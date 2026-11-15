import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_TABLES,
  INITIAL_QUEUE,
  INITIAL_WAITERS,
  INITIAL_RESERVATIONS,
  INITIAL_INGREDIENTS,
  MENU_DISHES,
} from './data';
import {
  computeBayesianTurnoverProb,
  runAStarAllocation,
  runSearchBenchmarks,
  stepMultiAgentSimulation,
  compareTurnoverModels,
  predictCustomPartyDuration,
  computeFairnessAudit,
} from './aiEngine';
import {
  validateBookingWorkflow,
  validateOrderIngredientsWorkflow,
} from './workflows';
import {
  buildGroqKnowledgeContext,
  evaluateGroundedMaitreD,
  HALLUCINATION_REFUSAL_TEXT,
  isExplicitOutOfScopeQuery,
} from './ragGrounding';
import {
  classifyTableForBooking,
  computeFloorOccupancySummary,
  resolveTableClickSelection,
} from '../../frontend/src/engine/floorMapHelpers';
import type { WaitingParty } from './types';

test('Bayesian turnover probability rises monotonically from Appetizer to Billing', () => {
  const appetizer = computeBayesianTurnoverProb('Occupied', 'Appetizer', 12);
  const mains = computeBayesianTurnoverProb('Occupied', 'Mains', 30);
  const dessert = computeBayesianTurnoverProb('Occupied', 'Dessert', 45);
  const billing = computeBayesianTurnoverProb('Paying', 'Billing', 55);

  assert.ok(appetizer < mains, 'Appetizer prob < Mains prob');
  assert.ok(mains < dessert, 'Mains prob < Dessert prob');
  assert.ok(dessert < billing, 'Dessert prob < Billing prob');
  assert.ok(billing >= 0.75, 'Paying/Billing prob must pass 75% pre-alloc threshold');
});

test('Rule R1 strictly enforces wheelchair accessibility during A* allocation', () => {
  const wheelchairParty: WaitingParty = {
    id: 'TEST-WC',
    name: 'Test Accessible',
    size: 2,
    isVip: false,
    needsWheelchair: true,
    preferredZone: 'Window',
    waitMins: 5,
    status: 'WAITING',
  };

  const result = runAStarAllocation(INITIAL_TABLES, wheelchairParty, 0);
  assert.equal(result.success, true);
  assert.ok(result.triggeredRules.some((r) => r.includes('R1')));
  const assignedTable = INITIAL_TABLES.find(
    (t) => t.id === result.assignedTableIds[0],
  );
  assert.equal(assignedTable?.isAccessible, true);
});

test('Rule R2 merges adjacent tables T3 + T4 for accessible party of 8 with zero wasted seats', () => {
  const largeParty: WaitingParty = {
    id: 'TEST-LG',
    name: 'Banquet Eight',
    size: 8,
    isVip: false,
    needsWheelchair: true,
    preferredZone: 'Main Hall',
    waitMins: 3,
    status: 'WAITING',
  };

  const result = runAStarAllocation(INITIAL_TABLES, largeParty, 0);
  assert.equal(result.success, true);
  assert.equal(result.isMerged, true);
  assert.deepEqual(result.assignedTableIds, ['T3', 'T4']);
  assert.equal(result.wastedSeats, 0);
});

test('Rule R3 triggers complimentary starter for VIP wait > 10 mins and respects A* weights', () => {
  const vipWaiting: WaitingParty = {
    id: 'TEST-VIP',
    name: 'VIP Guest',
    size: 5,
    isVip: true,
    needsWheelchair: false,
    preferredZone: 'VIP Lounge',
    waitMins: 14,
    status: 'WAITING',
  };

  const resultDefault = runAStarAllocation(INITIAL_TABLES, vipWaiting, 1, {
    w1Waste: 1,
    w2Wait: 1,
  });
  const resultHeavyWaste = runAStarAllocation(INITIAL_TABLES, vipWaiting, 1, {
    w1Waste: 3,
    w2Wait: 1,
  });

  assert.equal(resultDefault.success, true);
  assert.equal(resultDefault.complimentaryStarterTriggered, true);
  assert.ok(resultDefault.triggeredRules.some((r) => r.includes('R3')));
  assert.ok(resultHeavyWaste.hScore > resultDefault.hScore);
});

test('Workflow A confirms fulfillable bookings with QR/email preview AND politely suggests alternatives on conflict', () => {
  const fulfillable = validateBookingWorkflow(
    {
      guestName: 'Meera Patel',
      email: 'meera@example.com',
      phone: '+91 98200 11122',
      dateTime: '2026-11-14T20:30',
      partySize: 4,
      preferredZone: 'Main Hall',
      needsWheelchair: true,
      specialRequests: 'Window adjacent if possible',
    },
    INITIAL_TABLES,
    INITIAL_RESERVATIONS,
  );
  assert.equal(fulfillable.fulfillable, true);
  assert.ok(fulfillable.reservation?.bookingId.startsWith('KK-'));
  assert.ok(fulfillable.emailPreview?.to === 'meera@example.com');

  const unfulfillable = validateBookingWorkflow(
    {
      guestName: 'Conflict Group',
      email: 'conflict@example.com',
      phone: '+91 98200 33344',
      dateTime: '2026-11-14T20:00',
      partySize: 6,
      preferredZone: 'VIP Lounge',
      needsWheelchair: true,
      specialRequests: 'VIP accessible for 6',
    },
    INITIAL_TABLES,
    INITIAL_RESERVATIONS,
  );
  assert.equal(unfulfillable.fulfillable, false);
  assert.ok(unfulfillable.apologyMessage);
  assert.ok((unfulfillable.alternatives?.length ?? 0) >= 2);
});

test('Workflow B atomically deducts recipe ingredients when in stock and detects out-of-stock substitutes cleanly', () => {
  const inStockResp = validateOrderIngredientsWorkflow(
    {
      tableId: 'T3',
      bookingId: 'KK-8942',
      items: [{ dishId: 'dish-truffle-paneer', quantity: 2 }],
    },
    MENU_DISHES,
    INITIAL_INGREDIENTS,
  );
  assert.equal(inStockResp.ok, true);
  assert.ok(inStockResp.order);
  const truffleAfter = inStockResp.updatedIngredients?.find(
    (i) => i.id === 'ing-truffle',
  );
  assert.equal(truffleAfter?.stock, 60); // 90 - 2*15

  const zeroTruffle = INITIAL_INGREDIENTS.map((i) =>
    i.id === 'ing-truffle' ? { ...i, stock: 0 } : i,
  );
  const outStockResp = validateOrderIngredientsWorkflow(
    {
      tableId: 'T3',
      bookingId: 'KK-8942',
      items: [{ dishId: 'dish-truffle-paneer', quantity: 1 }],
    },
    MENU_DISHES,
    zeroTruffle,
  );
  assert.equal(outStockResp.ok, false);
  assert.equal(outStockResp.conflicts?.[0].dishId, 'dish-truffle-paneer');
  assert.ok((outStockResp.conflicts?.[0].suggestedSubstitutes.length ?? 0) >= 1);
});

test('Search benchmark, MAS tick, ML predictor, fairness audit, and grounded RAG refusal all work', () => {
  const benchmarks = runSearchBenchmarks(INITIAL_TABLES, INITIAL_QUEUE);
  assert.equal(benchmarks.length, 4);
  assert.equal(benchmarks.find((b) => b.algorithm === 'A* Search')?.isOptimal, true);

  const sim = stepMultiAgentSimulation(
    INITIAL_TABLES,
    INITIAL_QUEUE,
    INITIAL_WAITERS,
    0,
  );
  assert.equal(sim.tables.find((t) => t.id === 'T2')?.status, 'Free');

  const custom = predictCustomPartyDuration({
    size: 6,
    isWeekend: true,
    isPeakHour: true,
    orderedDrinks: true,
  });
  assert.equal(custom.symbolicTotalMins, 75);

  const { symbolicMae, mlMae } = compareTurnoverModels(INITIAL_TABLES);
  assert.ok(mlMae < symbolicMae);

  const audit = computeFairnessAudit(INITIAL_QUEUE);
  assert.equal(typeof audit.fairnessScorePct, 'number');

  const refusal = evaluateGroundedMaitreD(
    'Do you have a rooftop swimming pool?',
    INITIAL_TABLES,
    INITIAL_QUEUE,
    INITIAL_WAITERS,
    INITIAL_INGREDIENTS,
    INITIAL_RESERVATIONS,
  );
  assert.equal(refusal.refusalTriggered, true);
  assert.equal(refusal.reply, HALLUCINATION_REFUSAL_TEXT);
});

test('BookMyShow floor map helpers classify occupancy, enforce Rule R1/R2 on click, and lock preferredTableIds', () => {
  const summary = computeFloorOccupancySummary(
    INITIAL_TABLES,
    INITIAL_RESERVATIONS,
    '2026-11-14T21:00',
  );
  assert.equal(summary.free, 4);
  assert.equal(summary.payingSoon, 2);
  assert.equal(summary.occupied, 3);
  assert.equal(summary.clearing, 1);

  // Rule R1 blocks non-accessible T8 when wheelchair is required
  const blockedR1 = resolveTableClickSelection(
    INITIAL_TABLES,
    INITIAL_RESERVATIONS,
    'T8',
    {
      partySize: 4,
      needsWheelchair: true,
      dateTime: '2026-11-14T21:00',
    },
  );
  assert.equal(blockedR1.accepted, false);
  assert.ok(blockedR1.reason.includes('Rule R1'));

  // Clicking T3 for party of 8 auto-merges T3 + T4 via Rule R2
  const mergedClick = resolveTableClickSelection(
    INITIAL_TABLES,
    INITIAL_RESERVATIONS,
    'T3',
    {
      partySize: 8,
      needsWheelchair: true,
      dateTime: '2026-11-14T21:00',
    },
  );
  assert.equal(mergedClick.accepted, true);
  assert.deepEqual(mergedClick.selectedTableIds, ['T3', 'T4']);
  assert.equal(mergedClick.resolvedZone, 'Main Hall');

  // Slot-booked classification marks T3 as SLOT_BOOKED at 20:00
  const t3 = INITIAL_TABLES.find((t) => t.id === 'T3')!;
  const bookedCls = classifyTableForBooking(
    t3,
    INITIAL_TABLES,
    INITIAL_RESERVATIONS,
    {
      partySize: 4,
      needsWheelchair: true,
      dateTime: '2026-11-14T20:00',
      pinnedTableIds: [],
      aiRecommendedTableIds: [],
    },
  );
  assert.equal(bookedCls.state, 'SLOT_BOOKED');
  assert.equal(bookedCls.selectable, false);

  // Booking workflow honors pinnedTableIds ['T7'] when eligible
  const pinnedBooking = validateBookingWorkflow(
    {
      guestName: 'Kabir Mehta',
      email: 'kabir@example.com',
      phone: '+91 98200 99887',
      dateTime: '2026-11-14T21:00',
      partySize: 2,
      preferredZone: 'Window',
      needsWheelchair: true,
      specialRequests: 'Corner window',
      preferredTableIds: ['T7'],
    },
    INITIAL_TABLES,
    INITIAL_RESERVATIONS,
  );
  assert.equal(pinnedBooking.fulfillable, true);
  assert.deepEqual(pinnedBooking.reservation?.assignedTableIds, ['T7']);
});

import {
  SVG_FLOOR_VIEWBOX,
  SVG_STATUS_COLORS,
  SVG_TABLE_BOXES,
  getChairRectanglesForNode,
} from '../../frontend/src/engine/svgFloorLayout';

test('SVG dashboard floor layout defines valid non-overlapping bounds and chair geometry for T1-T10', () => {
  for (const table of INITIAL_TABLES) {
    const box = SVG_TABLE_BOXES[table.id];
    assert.ok(box, `Missing SVG box for ${table.id}`);
    assert.ok(box.x >= 0 && box.x + box.width <= SVG_FLOOR_VIEWBOX.width);
    assert.ok(box.y >= 0 && box.y + box.height <= SVG_FLOOR_VIEWBOX.height);

    const chairs = getChairRectanglesForNode(box, table.capacity);
    assert.equal(chairs.length, table.capacity);
  }
  assert.equal(SVG_STATUS_COLORS.Free.stroke, '#059669');
  assert.equal(SVG_STATUS_COLORS.Occupied.stroke, '#DC2626');
});

import {
  evaluateScenarioComparison,
  SCENARIO_PRESETS,
} from '../../frontend/src/engine/scenarioComparison';

test('Teacher Algorithm Scenarios produce distinct worked decisions across BFS, DFS, Hill Climbing, and A*', () => {
  assert.equal(SCENARIO_PRESETS.length, 4);

  const scen1 = evaluateScenarioComparison('accessible-merge', { w1Waste: 1, w2Wait: 1 });
  const scen1Hc = scen1.decisions.find((d) => d.algorithm === 'Hill Climbing');
  const scen1AStar = scen1.decisions.find((d) => d.algorithm === 'A* Search');
  assert.equal(scen1Hc?.chosenTableIds.length, 0);
  assert.deepEqual(scen1AStar?.chosenTableIds, ['T3', 'T4']);

  const scen2 = evaluateScenarioComparison('couple-waste-trap', { w1Waste: 1, w2Wait: 1 });
  const scen2Bfs = scen2.decisions.find((d) => d.algorithm === 'BFS');
  const scen2Dfs = scen2.decisions.find((d) => d.algorithm === 'DFS');
  const scen2AStar = scen2.decisions.find((d) => d.algorithm === 'A* Search');
  assert.deepEqual(scen2Bfs?.chosenTableIds, ['T4']);
  assert.deepEqual(scen2Dfs?.chosenTableIds, ['T8']);
  assert.deepEqual(scen2AStar?.chosenTableIds, ['T7']);
  assert.equal(scen2AStar?.wastedSeats, 0);

  const scen3 = evaluateScenarioComparison('bayesian-vip-rush', { w1Waste: 1, w2Wait: 1 });
  const scen3AStar = scen3.decisions.find((d) => d.algorithm === 'A* Search');
  assert.deepEqual(scen3AStar?.chosenTableIds, ['T10']);

  const scen4 = evaluateScenarioComparison('symbolic-vs-ml', { w1Waste: 1, w2Wait: 1 });
  assert.ok(scen4.mlProbe, 'Scenario 4 includes ML & Bayesian probe');
  assert.ok(
    scen4.mlProbe.durationPrediction.mlTotalMins >
      scen4.mlProbe.durationPrediction.symbolicTotalMins,
  );
});

test('Groq RAG Grounding handles nut-free allergens, wheelchair party of 5, context injection, and strict refusal', () => {
  assert.equal(
    HALLUCINATION_REFUSAL_TEXT,
    'I cannot verify that information from our current restaurant knowledge base or live floor data.',
  );

  const nutFree = evaluateGroundedMaitreD(
    'Which dishes are nut-free?',
    INITIAL_TABLES,
    INITIAL_QUEUE,
    INITIAL_WAITERS,
    INITIAL_INGREDIENTS,
    INITIAL_RESERVATIONS,
  );
  assert.equal(nutFree.refusalTriggered, false);
  assert.ok(nutFree.reply.includes('Royal Zafrani Dum Biryani'));
  assert.ok(nutFree.reply.includes('Cashews') && nutFree.reply.includes('Pistachio'));
  assert.ok(nutFree.sources.includes('[restaurant_policies.md]'));

  const wheelchairFive = evaluateGroundedMaitreD(
    'Can a wheelchair party of 5 sit together?',
    INITIAL_TABLES,
    INITIAL_QUEUE,
    INITIAL_WAITERS,
    INITIAL_INGREDIENTS,
    INITIAL_RESERVATIONS,
  );
  assert.equal(wheelchairFive.refusalTriggered, false);
  assert.ok(wheelchairFive.reply.includes('T3') && wheelchairFive.reply.includes('T4'));
  assert.ok(wheelchairFive.sources.includes('[live_floor_db]'));

  const contextStr = buildGroqKnowledgeContext({
    portal: 'customer',
    tables: INITIAL_TABLES,
    queue: INITIAL_QUEUE,
    waiters: INITIAL_WAITERS,
    ingredients: INITIAL_INGREDIENTS,
    reservations: INITIAL_RESERVATIONS,
  });
  assert.ok(contextStr.includes('STATIC_KNOWLEDGE_BASE [restaurant_policies.md]'));
  assert.ok(contextStr.includes('LIVE_FLOOR_AND_KITCHEN_STATE [live_floor_db]'));
  assert.ok(contextStr.includes('11:30 AM'));
});

test('Groq RAG Grounding handles greetings/identity naturally, answers menu queries, and strictly refuses out-of-scope traps', () => {
  const greeting = evaluateGroundedMaitreD(
    'hi who you are',
    INITIAL_TABLES,
    INITIAL_QUEUE,
    INITIAL_WAITERS,
    INITIAL_INGREDIENTS,
    INITIAL_RESERVATIONS,
  );
  assert.equal(greeting.refusalTriggered, false);
  assert.ok(greeting.reply.includes('Khana-Khazana'));
  assert.ok(isExplicitOutOfScopeQuery('hi who you are') === false);

  const menuAsk = evaluateGroundedMaitreD(
    'What signature dishes do you recommend and what are prices?',
    INITIAL_TABLES,
    INITIAL_QUEUE,
    INITIAL_WAITERS,
    INITIAL_INGREDIENTS,
    INITIAL_RESERVATIONS,
  );
  assert.equal(menuAsk.refusalTriggered, false);
  assert.ok(menuAsk.reply.includes('₹'));

  assert.equal(isExplicitOutOfScopeQuery('Do you have a rooftop pool?'), true);
  const weatherRefusal = evaluateGroundedMaitreD(
    'What is the weather outside?',
    INITIAL_TABLES,
    INITIAL_QUEUE,
    INITIAL_WAITERS,
    INITIAL_INGREDIENTS,
    INITIAL_RESERVATIONS,
  );
  assert.equal(weatherRefusal.refusalTriggered, true);
  assert.equal(weatherRefusal.reply, HALLUCINATION_REFUSAL_TEXT);
});

import { normalizeApiBase } from '../../frontend/src/api/backendService';

test('normalizeApiBase rejects bare port strings like 3000 and localhost URLs on remote hosts', () => {
  assert.equal(normalizeApiBase('3000', 'khana-khazana-dun.vercel.app'), '');
  assert.equal(normalizeApiBase('localhost:3000', 'khana-khazana-dun.vercel.app'), '');
  assert.equal(normalizeApiBase('http://localhost:8000', 'khana-khazana-dun.vercel.app'), '');
  assert.equal(normalizeApiBase('http://localhost:3000', 'localhost'), 'http://localhost:3000');
  assert.equal(normalizeApiBase('https://api.khana-khazana.app/', 'khana-khazana-dun.vercel.app'), 'https://api.khana-khazana.app');
});

