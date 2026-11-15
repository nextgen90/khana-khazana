/**
 * Modular Backend Service Layer for Khana-Khazana Dual-Portal Architecture.
 *
 * Connected to Node.js + Express + NeonDB PostgreSQL (`/api/*`).
 */

import type {
  AgentEvent,
  AllocationResult,
  AStarWeights,
  BookingValidationRequest,
  BookingValidationResponse,
  CourseStage,
  IngredientItem,
  KitchenOrder,
  MaitreDMessage,
  MenuDish,
  OrderIngredientValidationRequest,
  OrderIngredientValidationResponse,
  ReservationRecord,
  RestaurantTable,
  TableStatus,
  WaitingParty,
  WaiterAgent,
  XaiAuditLog,
} from '../../../backend/engine/types';
import {
  allocateTableForArrivalWorkflow,
  validateBookingWorkflow,
  validateOrderIngredientsWorkflow,
} from '../../../backend/engine/workflows';

export interface HydratedFloorPayload {
  dbConnected: boolean;
  dbLatencyMs: number;
  tables: RestaurantTable[];
  queue: WaitingParty[];
  reservations: ReservationRecord[];
  ingredients: IngredientItem[];
  orders: KitchenOrder[];
  waiters: WaiterAgent[];
  events: AgentEvent[];
  xaiLogs: XaiAuditLog[];
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

export async function fetchFloorStateFromApi(): Promise<HydratedFloorPayload | null> {
  try {
    const resp = await fetch(`${API_BASE}/api/floor/state`);
    if (!resp.ok) return null;
    const data = (await resp.json()) as HydratedFloorPayload & { ok?: boolean };
    if (!data.ok) return null;
    return data;
  } catch {
    return null;
  }
}

export async function validateAndCreateBooking(
  payload: BookingValidationRequest,
  tables: RestaurantTable[],
  reservations: ReservationRecord[],
): Promise<BookingValidationResponse> {
  const t0 = performance.now();
  try {
    const resp = await fetch('/api/bookings/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request: payload,
        tables,
        reservations,
      }),
    });
    if (resp.ok) {
      const data = (await resp.json()) as BookingValidationResponse;
      return {
        ...data,
        responseTimeMs: Math.max(
          25,
          Math.round(data.responseTimeMs || performance.now() - t0),
        ),
      };
    }
  } catch {
    // Graceful local validation fallback if offline
  }

  return validateBookingWorkflow(payload, tables, reservations);
}

export async function checkInGuestViaApi(
  bookingIdOrPartyId: string,
  weights?: AStarWeights,
): Promise<{
  allocation: AllocationResult;
  responseTimeMs: number;
  xaiLog?: XaiAuditLog;
  agentEvent?: AgentEvent;
} | null> {
  try {
    const resp = await fetch('/api/bookings/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingIdOrPartyId, weights }),
    });
    if (!resp.ok) return null;
    return (await resp.json()) as {
      allocation: AllocationResult;
      responseTimeMs: number;
      xaiLog?: XaiAuditLog;
      agentEvent?: AgentEvent;
    };
  } catch {
    return null;
  }
}

export async function validateOrderIngredients(
  payload: OrderIngredientValidationRequest,
  menuDishes: MenuDish[],
  ingredients: IngredientItem[],
): Promise<OrderIngredientValidationResponse & { agentEvent?: AgentEvent }> {
  const t0 = performance.now();
  try {
    const resp = await fetch('/api/orders/validate-ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request: payload,
        menuDishes,
        ingredients,
      }),
    });
    if (resp.ok) {
      const data = (await resp.json()) as OrderIngredientValidationResponse & {
        agentEvent?: AgentEvent;
      };
      return {
        ...data,
        responseTimeMs: Math.max(
          20,
          Math.round(data.responseTimeMs || performance.now() - t0),
        ),
      };
    }
  } catch {
    // Graceful local fallback
  }

  return validateOrderIngredientsWorkflow(payload, menuDishes, ingredients);
}

export async function advanceOrderStatusApi(
  orderId: string,
): Promise<KitchenOrder | null> {
  try {
    const resp = await fetch(`/api/orders/${encodeURIComponent(orderId)}/advance`, {
      method: 'PATCH',
    });
    if (!resp.ok) return null;
    const data = (await resp.json()) as { order?: KitchenOrder };
    return data.order ?? null;
  } catch {
    return null;
  }
}

export async function updateIngredientStockApi(
  ingredientId: string,
  stock: number,
): Promise<IngredientItem | null> {
  try {
    const resp = await fetch(
      `/api/ingredients/${encodeURIComponent(ingredientId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      },
    );
    if (!resp.ok) return null;
    const data = (await resp.json()) as { ingredient?: IngredientItem };
    return data.ingredient ?? null;
  } catch {
    return null;
  }
}

export async function updateTableStateApi(
  tableId: string,
  status: TableStatus,
  course?: CourseStage,
): Promise<RestaurantTable | null> {
  try {
    const resp = await fetch(`/api/tables/${encodeURIComponent(tableId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, course }),
    });
    if (!resp.ok) return null;
    const data = (await resp.json()) as { table?: RestaurantTable };
    return data.table ?? null;
  } catch {
    return null;
  }
}

export async function stepSimulationTickApi(tickCount: number): Promise<{
  tables: RestaurantTable[];
  queue: WaitingParty[];
  waiters: WaiterAgent[];
  newEvents: AgentEvent[];
} | null> {
  try {
    const resp = await fetch('/api/simulation/tick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickCount }),
    });
    if (!resp.ok) return null;
    return (await resp.json()) as {
      tables: RestaurantTable[];
      queue: WaitingParty[];
      waiters: WaiterAgent[];
      newEvents: AgentEvent[];
    };
  } catch {
    return null;
  }
}

export async function resetFloorApi(): Promise<HydratedFloorPayload | null> {
  try {
    const resp = await fetch('/api/floor/reset', { method: 'POST' });
    if (!resp.ok) return null;
    const data = (await resp.json()) as HydratedFloorPayload & { ok?: boolean };
    return data.ok ? data : null;
  } catch {
    return null;
  }
}

export async function allocateTableViaAStar(
  tables: RestaurantTable[],
  party: WaitingParty,
  remainingQueueCount: number,
  weights?: AStarWeights,
): Promise<{ result: AllocationResult; responseTimeMs: number }> {
  const t0 = performance.now();
  try {
    const resp = await fetch('/api/ai/allocate-table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tables,
        party,
        remainingQueueCount,
        weights,
      }),
    });
    if (resp.ok) {
      const data = (await resp.json()) as { result: AllocationResult };
      return {
        result: data.result,
        responseTimeMs: Math.max(20, Math.round(performance.now() - t0)),
      };
    }
  } catch {
    // Fallback
  }

  const result = allocateTableForArrivalWorkflow(tables, party, remainingQueueCount);
  return {
    result,
    responseTimeMs: Math.round(performance.now() - t0),
  };
}

export async function queryMaitreDRag(params: {
  message: string;
  portal: 'customer' | 'admin';
  tables: RestaurantTable[];
  queue: WaitingParty[];
  waiters: WaiterAgent[];
  ingredients: IngredientItem[];
  reservations: ReservationRecord[];
}): Promise<
  Pick<
    MaitreDMessage,
    'content' | 'sources' | 'refusalTriggered' | 'latencyMs' | 'model' | 'provider'
  >
> {
  const t0 = performance.now();
  const resp = await fetch(`${API_BASE}/api/groq/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = (await resp.json()) as {
    reply?: string;
    sources?: string[];
    refusalTriggered?: boolean;
    latencyMs?: number;
    model?: string;
    provider?: 'groq' | 'grounded-simulator';
  };
  return {
    content:
      data.reply ??
      'I cannot verify that information from our current restaurant knowledge base or live floor data.',
    sources: data.sources ?? ['[restaurant_policies.md]', '[live_floor_db]'],
    refusalTriggered: Boolean(data.refusalTriggered),
    latencyMs: data.latencyMs ?? Math.round(performance.now() - t0),
    model: data.model ?? 'openai/gpt-oss-120b',
    provider: data.provider ?? 'grounded-simulator',
  };
}
