import {
  computeBayesianTurnoverProb,
  computeFloorEfficiency,
  runAStarAllocation,
} from './aiEngine';
import { MENU_DISHES, RESTAURANT_POLICIES_CHUNKS } from './data';
import type {
  IngredientItem,
  ReservationRecord,
  RestaurantTable,
  WaitingParty,
  WaiterAgent,
} from './types';

export const HALLUCINATION_REFUSAL_TEXT =
  'I cannot verify that information from the current floor data or restaurant policies.';

const OUT_OF_SCOPE_PATTERNS = [
  /swimming\s*pool/i,
  /rooftop\s*pool/i,
  /\bpool\b/i,
  /\bspa\b/i,
  /helipad/i,
  /helicopter/i,
  /hotel\s*room/i,
  /casino/i,
  /bowling/i,
  /pet\s*groom/i,
  /cryptocurrency/i,
  /stock\s*price/i,
  /weather/i,
];

const IN_DOMAIN_KEYWORDS = [
  'table',
  't1',
  't2',
  't3',
  't4',
  't5',
  't6',
  't7',
  't8',
  't9',
  't10',
  'seat',
  'wheelchair',
  'access',
  'step-free',
  'vip',
  'complimentary',
  'starter',
  'r1',
  'r2',
  'r3',
  'combine',
  'merge',
  'wait',
  'queue',
  'bayes',
  'prob',
  'free',
  'paying',
  'dirty',
  'window',
  'main hall',
  'lounge',
  'waiter',
  'agent',
  'host',
  'arjun',
  'kavya',
  'rohan',
  'menu',
  'dish',
  'paneer',
  'truffle',
  'dal',
  'makhani',
  'biryani',
  'saffron',
  'penne',
  'pizza',
  'gulab',
  'jain',
  'vegan',
  'gluten',
  'allergen',
  'hour',
  'open',
  'close',
  'policy',
  'policies',
  'floor',
  'party',
  'group',
  'reservation',
  'booking',
  'book',
  'qr',
  'stock',
  'inventory',
  'ingredient',
  'fairness',
];

export function evaluateGroundedMaitreD(
  query: string,
  tables: RestaurantTable[],
  queue: WaitingParty[],
  waiters: WaiterAgent[],
  ingredients: IngredientItem[] = [],
  reservations: ReservationRecord[] = [],
): { reply: string; sources: string[]; refusalTriggered: boolean } {
  const q = query.toLowerCase().trim();

  if (OUT_OF_SCOPE_PATTERNS.some((rx) => rx.test(q))) {
    return {
      reply: HALLUCINATION_REFUSAL_TEXT,
      sources: [
        'Policy Doc: restaurant_policies.md (POL-05 Facility Boundaries)',
        'Floor State Snapshot',
      ],
      refusalTriggered: true,
    };
  }

  const hasDomainAnchor = IN_DOMAIN_KEYWORDS.some((kw) => q.includes(kw));
  if (!hasDomainAnchor) {
    return {
      reply: HALLUCINATION_REFUSAL_TEXT,
      sources: ['Policy Doc: restaurant_policies.md', 'Floor State Snapshot'],
      refusalTriggered: true,
    };
  }

  const freeTables = tables.filter((t) => t.status === 'Free');
  const accessibleFree = freeTables.filter((t) => t.isAccessible);
  const payingTables = tables.filter((t) => t.status === 'Paying');
  const waiting = queue.filter((p) => p.status === 'WAITING');
  const eff = computeFloorEfficiency(tables);

  if (
    q.includes('stock') ||
    q.includes('inventory') ||
    q.includes('ingredient') ||
    q.includes('truffle') ||
    q.includes('saffron') ||
    q.includes('penne')
  ) {
    if (ingredients.length > 0) {
      const lowOrZero = ingredients.filter((i) => i.stock <= i.parLevel * 0.2);
      const summary = ingredients
        .map((i) => `${i.name}: ${i.stock}${i.unit}`)
        .join(', ');
      return {
        reply:
          lowOrZero.length > 0
            ? `Kitchen Inventory Alert — low/out items: ${lowOrZero
                .map((i) => `${i.name} (${i.stock}${i.unit})`)
                .join(', ')}. Live stock snapshot: ${summary}.`
            : `All tracked kitchen ingredients are in stock: ${summary}.`,
        sources: ['NeonDB Live Kitchen Inventory', 'Recipe Stock Registry'],
        refusalTriggered: false,
      };
    }
  }

  if (q.includes('wheelchair') || q.includes('access') || q.includes('r1')) {
    const allAccessible = tables.filter((t) => t.isAccessible);
    const readyList =
      accessibleFree.length > 0
        ? accessibleFree
            .map((t) => `${t.id} (${t.capacity} seats, ${t.zone})`)
            .join(', ')
        : 'none immediately Free';
    const soonest = allAccessible
      .filter((t) => t.status !== 'Free')
      .map(
        (t) =>
          `${t.id} (${t.status}, P(Free₁₀)=${Math.round(
            computeBayesianTurnoverProb(t.status, t.currentCourse, t.elapsedMins) *
              100,
          )}%)`,
      )
      .join('; ');

    return {
      reply: `Rule R1 enforces step-free access across tables ${allAccessible
        .map((t) => t.id)
        .join(', ')}. Currently ${accessibleFree.length} accessible table${
        accessibleFree.length === 1 ? ' is' : 's are'
      } Free: ${readyList}. Other accessible tables in cadence: ${
        soonest || 'all currently open'
      }.`,
      sources: [
        'Floor State Snapshot',
        'Policy Doc: restaurant_policies.md (POL-01)',
      ],
      refusalTriggered: false,
    };
  }

  if (
    q.includes('vip') ||
    q.includes('complimentary') ||
    q.includes('starter') ||
    q.includes('r3')
  ) {
    const vipTables = tables.filter((t) => t.isVipBooth);
    return {
      reply: `${RESTAURANT_POLICIES_CHUNKS[1].content} Live VIP Lounge & celebration booths: ${vipTables
        .map((t) => `${t.id} (${t.capacity} seats · ${t.status})`)
        .join(', ')}.`,
      sources: [
        'Policy Doc: restaurant_policies.md (POL-02)',
        'Floor State Snapshot',
      ],
      refusalTriggered: false,
    };
  }

  if (
    q.includes('menu') ||
    q.includes('dish') ||
    q.includes('paneer') ||
    q.includes('pizza') ||
    q.includes('biryani') ||
    q.includes('gulab') ||
    q.includes('dal') ||
    q.includes('jain') ||
    q.includes('vegan') ||
    q.includes('gluten') ||
    q.includes('allergen') ||
    q.includes('hour') ||
    q.includes('open')
  ) {
    const gfDishes = MENU_DISHES.filter((d) =>
      d.dietaryTags.some((tag) => tag.toLowerCase().includes('gluten-free')),
    )
      .map((d) => `${d.name} (₹${d.price})`)
      .join(', ');
    return {
      reply: `${RESTAURANT_POLICIES_CHUNKS[3].content} Verified Gluten-Free selections: ${gfDishes}.`,
      sources: ['Policy Doc: restaurant_policies.md (POL-04)', 'Live QR Menu'],
      refusalTriggered: false,
    };
  }

  if (
    q.includes('reservation') ||
    q.includes('booking') ||
    q.includes('wait') ||
    q.includes('ready') ||
    q.includes('combine') ||
    q.includes('merge') ||
    q.includes('large') ||
    q.includes('party') ||
    q.includes('group') ||
    q.includes('bayes') ||
    /\b[5-9]|10\b/.test(q)
  ) {
    const size = q.includes('10')
      ? 10
      : q.includes('8')
      ? 8
      : q.includes('7')
      ? 7
      : q.includes('6')
      ? 6
      : 5;
    const probeParty: WaitingParty = {
      id: 'PROBE',
      name: 'Guest Inquiry',
      size,
      isVip: q.includes('vip'),
      needsWheelchair: q.includes('wheelchair'),
      preferredZone: 'ANY',
      waitMins: 0,
      status: 'WAITING',
    };
    const probe = runAStarAllocation(tables, probeParty, waiting.length);
    const payingDetails =
      payingTables.length > 0
        ? payingTables
            .map(
              (t) =>
                `${t.id} (${t.zone}, P(Free₁₀)=${Math.round(
                  computeBayesianTurnoverProb(
                    t.status,
                    t.currentCourse,
                    t.elapsedMins,
                  ) * 100,
                )}%)`,
            )
            .join(', ')
        : 'none currently in Paying stage';

    return {
      reply: `Floor snapshot shows ${freeTables.length} Free tables (${
        freeTables.map((t) => `${t.id} · ${t.capacity}s`).join(', ') || 'none'
      }), ${reservations.length} confirmed NeonDB reservation(s), and Paying tables ${payingDetails}. For a party of ${size}, A* recommends ${
        probe.success
          ? `${probe.assignedTableIds.join(' + ')} (f=${probe.fScore}, ${
              probe.wastedSeats
            } wasted seats)`
          : 'holding in queue until next Bayesian release'
      }.`,
      sources: [
        'Floor State Snapshot',
        'Policy Doc: restaurant_policies.md (POL-03)',
      ],
      refusalTriggered: false,
    };
  }

  const activeAgents = waiters
    .map((w) => `${w.id} (${w.currentAction} @ ${w.targetTableId ?? 'Queue'})`)
    .join(', ');

  return {
    reply: `Floor Command reports ${freeTables.length}/${tables.length} tables Free (${
      freeTables.map((t) => `${t.id} ${t.capacity}s`).join(', ') || 'none'
    }), ${eff.seatEfficiencyPct}% seat utilization, and ${waiting.length} waiting parties. Active agents: ${activeAgents}.`,
    sources: ['Floor State Snapshot', 'Live Agent Telemetry'],
    refusalTriggered: false,
  };
}
