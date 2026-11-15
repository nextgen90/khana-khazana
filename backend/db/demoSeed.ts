import type { PoolClient } from 'pg';
import type {
  AgentEvent,
  IngredientItem,
  KitchenOrder,
  ReservationRecord,
  WaitingParty,
  XaiAuditLog,
} from '../engine/types';

export const DEMO_INGREDIENTS: IngredientItem[] = [
  {
    id: 'ing-cashew',
    name: 'Roasted Goan Cashew Paste',
    unit: 'g',
    stock: 650,
    parLevel: 800,
    perOrderHighlight: '40g per Paneer Butter Masala (Tree Nut)',
  },
  {
    id: 'ing-pistachio',
    name: 'Iranian Pistachio Slivers',
    unit: 'g',
    stock: 420,
    parLevel: 500,
    perOrderHighlight: '15g per Saffron Gulab Jamun (Tree Nut)',
  },
];

export const DEMO_QUEUE: WaitingParty[] = [
  {
    id: 'P-105',
    name: 'Ananya Kapoor',
    size: 2,
    isVip: false,
    needsWheelchair: false,
    preferredZone: 'Window',
    dietaryNotes: 'Strict nut allergy · Royal Zafrani Dum Biryani',
    waitMins: 5,
    status: 'WAITING',
    bookingId: 'KK-9102',
  },
  {
    id: 'P-106',
    name: 'Devansh & Riya Malhotra',
    size: 6,
    isVip: true,
    needsWheelchair: false,
    preferredZone: 'VIP Lounge',
    dietaryNotes: 'Anniversary saffron tasting & welcome drink',
    waitMins: 14,
    status: 'WAITING',
    bookingId: 'KK-9118',
  },
  {
    id: 'P-107',
    name: 'Rao Couple',
    size: 2,
    isVip: false,
    needsWheelchair: false,
    preferredZone: 'Window',
    dietaryNotes: '24-Hour Smoked Dal Makhani + Biryani',
    waitMins: 0,
    status: 'SEATED',
    bookingId: 'KK-7401',
  },
  {
    id: 'P-108',
    name: 'Vikramaditya Party',
    size: 4,
    isVip: true,
    needsWheelchair: true,
    preferredZone: 'VIP Lounge',
    dietaryNotes: 'Step-free VIP suite',
    waitMins: 0,
    status: 'SEATED',
    bookingId: 'KK-7904',
  },
];

export const DEMO_RESERVATIONS: ReservationRecord[] = [
  {
    bookingId: 'KK-7401',
    guestName: 'Rao Couple',
    email: 'rao.couple@example.com',
    phone: '+91 98101 22310',
    dateTime: '2026-11-15T19:00',
    partySize: 2,
    preferredZone: 'Window',
    needsWheelchair: false,
    isVip: false,
    specialRequests: 'Corner bay window view',
    status: 'SEATED',
    assignedTableIds: ['T1'],
    qrPassCode: 'KK-QR-T1-7401',
    triggeredRules: ['Zone Match: Window', 'Minimal Waste Heuristic (0 wasted)'],
    bayesianConfidencePct: 100,
    fScore: 0,
    createdAt: '18:55:10',
  },
  {
    bookingId: 'KK-7512',
    guestName: 'Mehta Quartet',
    email: 'mehta.quartet@example.com',
    phone: '+91 98220 44109',
    dateTime: '2026-11-15T18:45',
    partySize: 4,
    preferredZone: 'Window',
    needsWheelchair: false,
    isVip: false,
    specialRequests: 'Gluten-free pizza option',
    status: 'SEATED',
    assignedTableIds: ['T5'],
    qrPassCode: 'KK-QR-T5-7512',
    triggeredRules: ['Zone Match: Window', 'Bayesian Billing Cadence Tracked'],
    bayesianConfidencePct: 88,
    fScore: 0.5,
    createdAt: '18:40:02',
  },
  {
    bookingId: 'KK-7618',
    guestName: 'Sen Family',
    email: 'sen.family@example.com',
    phone: '+91 98311 66780',
    dateTime: '2026-11-15T19:10',
    partySize: 3,
    preferredZone: 'Window',
    needsWheelchair: false,
    isVip: false,
    specialRequests: 'Warm Saffron Gulab Jamun dessert course',
    status: 'SEATED',
    assignedTableIds: ['T6'],
    qrPassCode: 'KK-QR-T6-7618',
    triggeredRules: ['Zone Match: Window', 'Dessert Cadence P(Free10)=62%'],
    bayesianConfidencePct: 62,
    fScore: 1,
    createdAt: '19:05:19',
  },
  {
    bookingId: 'KK-7904',
    guestName: 'Vikramaditya Party',
    email: 'vikram.vip@example.com',
    phone: '+91 98111 90011',
    dateTime: '2026-11-15T19:30',
    partySize: 4,
    preferredZone: 'VIP Lounge',
    needsWheelchair: true,
    isVip: true,
    specialRequests: 'Step-free VIP suite & saffron pairing',
    status: 'SEATED',
    assignedTableIds: ['T9'],
    qrPassCode: 'KK-QR-T9-7904',
    triggeredRules: ['R1: Accessible Filter', 'Zone Match: VIP Lounge'],
    bayesianConfidencePct: 100,
    fScore: 0.5,
    createdAt: '19:22:40',
  },
  {
    bookingId: 'KK-8010',
    guestName: 'Chatterjee Guests',
    email: 'chatterjee.h@example.com',
    phone: '+91 98300 77881',
    dateTime: '2026-11-15T18:50',
    partySize: 5,
    preferredZone: 'Main Hall',
    needsWheelchair: true,
    isVip: true,
    specialRequests: 'Wheelchair party of 5 · Main Hall Heritage table',
    status: 'SEATED',
    assignedTableIds: ['T10'],
    qrPassCode: 'KK-QR-T10-8010',
    triggeredRules: ['R1: Accessible Filter', 'Single 6-Top Preferred Over Merge'],
    bayesianConfidencePct: 91,
    fScore: 1,
    createdAt: '18:47:11',
  },
  {
    bookingId: 'KK-9102',
    guestName: 'Ananya Kapoor',
    email: 'ananya.kapoor@example.com',
    phone: '+91 98450 11223',
    dateTime: '2026-11-15T21:30',
    partySize: 2,
    preferredZone: 'Window',
    needsWheelchair: false,
    isVip: false,
    specialRequests: 'Nut-free menu verified via Concierge',
    status: 'CONFIRMED',
    assignedTableIds: ['T1'],
    qrPassCode: 'KK-QR-T1-9102',
    triggeredRules: ['Zone Match: Window', 'Allergen Audit Logged'],
    bayesianConfidencePct: 96,
    fScore: 0,
    createdAt: '20:04:15',
  },
  {
    bookingId: 'KK-9118',
    guestName: 'Devansh & Riya Malhotra',
    email: 'malhotra.vip@example.com',
    phone: '+91 98180 55432',
    dateTime: '2026-11-15T21:45',
    partySize: 6,
    preferredZone: 'VIP Lounge',
    needsWheelchair: false,
    isVip: true,
    specialRequests: 'Wait > 10m Saffron Masala Papad & Welcome Drink',
    status: 'CONFIRMED',
    assignedTableIds: ['T8'],
    qrPassCode: 'KK-QR-T8-9118',
    triggeredRules: ['Zone Match: VIP Lounge', 'R3: VIP Wait > 10m Amuse-Bouche'],
    bayesianConfidencePct: 100,
    fScore: 0.5,
    createdAt: '20:11:30',
  },
  {
    bookingId: 'KK-9150',
    guestName: 'Iyer Accessible Group',
    email: 'iyer.accessibility@example.com',
    phone: '+91 98401 33445',
    dateTime: '2026-11-16T13:00',
    partySize: 6,
    preferredZone: 'Main Hall',
    needsWheelchair: true,
    isVip: false,
    specialRequests: 'Step-free Main Hall lunch for 6 guests',
    status: 'CONFIRMED',
    assignedTableIds: ['T10'],
    qrPassCode: 'KK-QR-T10-9150',
    triggeredRules: ['R1: Accessible Filter', 'Zone Match: Main Hall'],
    bayesianConfidencePct: 100,
    fScore: 0,
    createdAt: '20:15:08',
  },
];

export const DEMO_ORDERS: KitchenOrder[] = [
  {
    orderId: 'ORD-302',
    tableId: 'T5',
    bookingId: 'KK-7512',
    items: [
      {
        dishId: 'dish-truffle-paneer',
        name: 'Truffle Paneer Tikka',
        quantity: 1,
        price: 540,
      },
      {
        dishId: 'dish-margherita',
        name: 'Wood-Fired Burrata Margherita',
        quantity: 1,
        price: 430,
      },
    ],
    totalAmount: 970,
    prepTimeMins: 14,
    status: 'Waiter En Route',
    dispatchedAgentId: 'W2',
    createdAt: '19:48:20',
  },
  {
    orderId: 'ORD-303',
    tableId: 'T6',
    bookingId: 'KK-7618',
    items: [
      {
        dishId: 'dish-gf-penne',
        name: 'Gluten-Free Masala Penne',
        quantity: 1,
        price: 450,
      },
      {
        dishId: 'dish-gulab-jamun',
        name: 'Warm Saffron & Pistachio Gulab Jamun',
        quantity: 2,
        price: 220,
      },
    ],
    totalAmount: 890,
    prepTimeMins: 14,
    status: 'Waiter En Route',
    dispatchedAgentId: 'W2',
    createdAt: '20:02:10',
  },
  {
    orderId: 'ORD-304',
    tableId: 'T9',
    bookingId: 'KK-7904',
    items: [
      {
        dishId: 'dish-saffron-biryani',
        name: 'Royal Saffron Dum Biryani',
        quantity: 2,
        price: 490,
      },
      {
        dishId: 'dish-truffle-paneer',
        name: 'Truffle Paneer Tikka',
        quantity: 1,
        price: 540,
      },
    ],
    totalAmount: 1520,
    prepTimeMins: 18,
    status: 'Preparing',
    dispatchedAgentId: 'W3',
    createdAt: '20:09:44',
  },
  {
    orderId: 'ORD-305',
    tableId: 'T10',
    bookingId: 'KK-8010',
    items: [
      {
        dishId: 'dish-dal-makhani',
        name: '24-Hour Smoked Dal Makhani',
        quantity: 2,
        price: 420,
      },
      {
        dishId: 'dish-chicken-paratha',
        name: 'Homestyle Chicken & Flaky Paratha',
        quantity: 2,
        price: 470,
      },
    ],
    totalAmount: 1780,
    prepTimeMins: 16,
    status: 'Waiter En Route',
    dispatchedAgentId: 'W1',
    createdAt: '19:35:00',
  },
  {
    orderId: 'ORD-306',
    tableId: 'T9',
    bookingId: 'KK-7904',
    items: [
      {
        dishId: 'dish-gulab-jamun',
        name: 'Warm Saffron & Pistachio Gulab Jamun',
        quantity: 2,
        price: 220,
      },
    ],
    totalAmount: 440,
    prepTimeMins: 8,
    status: 'Order Received',
    dispatchedAgentId: 'W3',
    createdAt: '20:14:50',
  },
];

export const DEMO_AGENT_EVENTS: AgentEvent[] = [
  {
    id: 'evt-demo-4',
    tick: 0,
    timestamp: '20:14:15',
    agentId: 'Host-01',
    agentName: 'Host-01 · Concierge',
    agentType: 'Host (Goal-Based)',
    utilityScore: 0.94,
    targetTableId: 'T5',
    message:
      'Bayesian Engine marked T5 Skyline North (Billing, 52m) at P(Free₁₀)=88% — eligible for pre-allocation.',
  },
  {
    id: 'evt-demo-5',
    tick: 0,
    timestamp: '20:14:22',
    agentId: 'W3',
    agentName: 'W3 · Rohan',
    agentType: 'Waiter (Utility-Based)',
    utilityScore: 0.91,
    targetTableId: 'T9',
    message:
      'W3 Rohan triggered Rule R3 Saffron Masala Papad & Welcome Drink for Devansh & Riya Malhotra (VIP wait 14m).',
  },
  {
    id: 'evt-demo-6',
    tick: 0,
    timestamp: '20:14:30',
    agentId: 'Host-01',
    agentName: 'Host-01 · Concierge',
    agentType: 'Host (Goal-Based)',
    utilityScore: 0.96,
    targetTableId: 'T10',
    message:
      'T10 Heritage Chef Table (Paying, 58m) reached P(Free₁₀)=91% — queued for Iyer Accessible Group.',
  },
  {
    id: 'evt-demo-7',
    tick: 0,
    timestamp: '20:14:42',
    agentId: 'W2',
    agentName: 'W2 · Kavya',
    agentType: 'Waiter (Utility-Based)',
    utilityScore: 0.89,
    targetTableId: 'T6',
    message:
      'W2 Kavya delivered ORD-303 (Gluten-Free Masala Penne + Saffron Gulab Jamun) to T6 Sen Family.',
  },
  {
    id: 'evt-demo-8',
    tick: 0,
    timestamp: '20:14:55',
    agentId: 'W1',
    agentName: 'W1 · Arjun',
    agentType: 'Waiter (Utility-Based)',
    utilityScore: 0.93,
    targetTableId: 'T10',
    message:
      'W1 Arjun locked atomic recipe pantry check for ORD-305 (2x Dal Makhani + 2x Chicken Paratha) on T10.',
  },
];

export const DEMO_XAI_LOGS: XaiAuditLog[] = [
  {
    id: 'xai-demo-3',
    timestamp: '20:10:05',
    partyName: 'Kulkarni Family Eight',
    partySize: 7,
    assignedTables: ['T3', 'T4'],
    algorithm: 'A* Search + Rule R2 Merge',
    fScore: 4.5,
    bayesianProb: 1.0,
    rulesApplied: ['R1: Accessible Filter', 'R2: Merge T3 + T4 (8 seats)'],
    justification:
      'No single 7-seat step-free table available; A* combined adjacent Main Hall accessible tables T3 + T4 (1 wasted seat).',
  },
  {
    id: 'xai-demo-4',
    timestamp: '20:11:30',
    partyName: 'Devansh & Riya Malhotra',
    partySize: 6,
    assignedTables: ['T8'],
    algorithm: 'A* Search + Rule R3 VIP',
    fScore: 0.5,
    bayesianProb: 1.0,
    rulesApplied: [
      'Zone Match: VIP Lounge',
      'R3: Wait > 10m → Saffron Masala Papad & Welcome Drink',
    ],
    justification:
      'Matched exact 6-top VIP Salon T8 (0 wasted seats) and dispatched Rule R3 lounge welcome drink without bumping R1 bookings.',
  },
  {
    id: 'xai-demo-5',
    timestamp: '20:04:15',
    partyName: 'Ananya Kapoor',
    partySize: 2,
    assignedTables: ['T1'],
    algorithm: 'Forward-Chaining + Bayesian Pre-Alloc',
    fScore: 1.2,
    bayesianProb: 0.96,
    rulesApplied: ['Zone Match: Window', 'Allergen Audit: Nut-Free Verified'],
    justification:
      'Assigned 2-top Window bay T1 for 21:30 turnover (0 wasted seats) and attached strict tree-nut exclusion ticket.',
  },
  {
    id: 'xai-demo-6',
    timestamp: '19:48:20',
    partyName: 'Mehta Quartet',
    partySize: 4,
    assignedTables: ['T5'],
    algorithm: 'Bayesian Turnover Monitor',
    fScore: 0.5,
    bayesianProb: 0.88,
    rulesApplied: ['Zone Match: Window', 'P(Free10) >= 75% Pre-Alloc Ready'],
    justification:
      'Billing stage reached 52m elapsed time; Bayesian model forecasts release inside 10 minutes with 88% confidence.',
  },
];

export async function insertDemoData(client: PoolClient): Promise<Record<string, number>> {
  const counts: Record<string, number> = {
    ingredients: 0,
    waiting_queue: 0,
    reservations: 0,
    kitchen_orders: 0,
    agent_events: 0,
    xai_audit_logs: 0,
  };

  for (const ing of DEMO_INGREDIENTS) {
    const r = await client.query(
      `INSERT INTO ingredients (id, name, unit, stock, par_level, per_order_highlight)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
      [ing.id, ing.name, ing.unit, ing.stock, ing.parLevel, ing.perOrderHighlight],
    );
    counts.ingredients += r.rowCount ?? 0;
  }

  for (const p of DEMO_QUEUE) {
    const r = await client.query(
      `INSERT INTO waiting_queue (
        id, name, size, is_vip, needs_wheelchair, preferred_zone,
        dietary_notes, wait_mins, status, booking_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (id) DO NOTHING`,
      [
        p.id,
        p.name,
        p.size,
        p.isVip,
        p.needsWheelchair,
        p.preferredZone,
        p.dietaryNotes ?? '',
        p.waitMins,
        p.status,
        p.bookingId ?? null,
      ],
    );
    counts.waiting_queue += r.rowCount ?? 0;
  }

  for (const rsv of DEMO_RESERVATIONS) {
    const r = await client.query(
      `INSERT INTO reservations (
        booking_id, guest_name, email, phone, date_time, party_size,
        preferred_zone, needs_wheelchair, is_vip, special_requests, status,
        assigned_table_ids, qr_pass_code, triggered_rules,
        bayesian_confidence_pct, f_score, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14::jsonb,$15,$16,$17)
      ON CONFLICT (booking_id) DO NOTHING`,
      [
        rsv.bookingId,
        rsv.guestName,
        rsv.email,
        rsv.phone,
        rsv.dateTime,
        rsv.partySize,
        rsv.preferredZone,
        rsv.needsWheelchair,
        rsv.isVip,
        rsv.specialRequests,
        rsv.status,
        JSON.stringify(rsv.assignedTableIds),
        rsv.qrPassCode,
        JSON.stringify(rsv.triggeredRules),
        rsv.bayesianConfidencePct,
        rsv.fScore,
        rsv.createdAt,
      ],
    );
    counts.reservations += r.rowCount ?? 0;
  }

  for (const ord of DEMO_ORDERS) {
    const r = await client.query(
      `INSERT INTO kitchen_orders (
        order_id, table_id, booking_id, items, total_amount,
        prep_time_mins, status, dispatched_agent_id, created_at
      ) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9)
      ON CONFLICT (order_id) DO NOTHING`,
      [
        ord.orderId,
        ord.tableId,
        ord.bookingId,
        JSON.stringify(ord.items),
        ord.totalAmount,
        ord.prepTimeMins,
        ord.status,
        ord.dispatchedAgentId,
        ord.createdAt,
      ],
    );
    counts.kitchen_orders += r.rowCount ?? 0;
  }

  for (const evt of DEMO_AGENT_EVENTS) {
    const r = await client.query(
      `INSERT INTO agent_events (
        id, tick, timestamp, agent_id, agent_name, agent_type,
        utility_score, target_table_id, message
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (id) DO NOTHING`,
      [
        evt.id,
        evt.tick,
        evt.timestamp,
        evt.agentId,
        evt.agentName,
        evt.agentType,
        evt.utilityScore,
        evt.targetTableId,
        evt.message,
      ],
    );
    counts.agent_events += r.rowCount ?? 0;
  }

  for (const log of DEMO_XAI_LOGS) {
    const r = await client.query(
      `INSERT INTO xai_audit_logs (
        id, timestamp, party_name, party_size, assigned_tables,
        algorithm, f_score, bayesian_prob, rules_applied, justification
      ) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10)
      ON CONFLICT (id) DO NOTHING`,
      [
        log.id,
        log.timestamp,
        log.partyName,
        log.partySize,
        JSON.stringify(log.assignedTables),
        log.algorithm,
        log.fScore,
        log.bayesianProb,
        JSON.stringify(log.rulesApplied),
        log.justification,
      ],
    );
    counts.xai_audit_logs += r.rowCount ?? 0;
  }

  return counts;
}
