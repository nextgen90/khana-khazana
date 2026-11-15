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
  evaluateGroundedMaitreD,
  HALLUCINATION_REFUSAL_TEXT,
} from './ragGrounding';
import {
  classifyTableForBooking,
  computeFloorOccupancySummary,
  resolveTableClickSelection,
} from './floorMapHelpers';
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
