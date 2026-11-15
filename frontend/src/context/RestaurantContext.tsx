import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  INITIAL_AGENT_EVENTS,
  INITIAL_INGREDIENTS,
  INITIAL_ORDERS,
  INITIAL_QUEUE,
  INITIAL_RESERVATIONS,
  INITIAL_TABLES,
  INITIAL_WAITERS,
  INITIAL_XAI_LOGS,
  MENU_DISHES,
} from '../../../backend/engine/data';
import {
  compareTurnoverModels,
  computeFairnessAudit,
  computeFloorEfficiency,
  runSearchBenchmarks,
  stepMultiAgentSimulation,
} from '../../../backend/engine/aiEngine';
import {
  advanceOrderStatusApi,
  allocateTableViaAStar,
  checkInGuestViaApi,
  fetchFloorStateFromApi,
  resetFloorApi,
  stepSimulationTickApi,
  updateIngredientStockApi,
  updateTableStateApi,
  validateAndCreateBooking,
  validateOrderIngredients,
} from '../api/backendService';
import type {
  AgentEvent,
  AlgorithmBenchmark,
  AllocationResult,
  AStarWeights,
  BookingValidationRequest,
  BookingValidationResponse,
  CartOrderItem,
  CourseStage,
  FairnessAudit,
  IngredientItem,
  KitchenOrder,
  OrderIngredientValidationResponse,
  OrderStatus,
  PortalMode,
  ReservationRecord,
  RestaurantTable,
  TableStatus,
  TurnoverPrediction,
  WaiterAgent,
  WaitingParty,
  XaiAuditLog,
} from '../../../backend/engine/types';

export type AppPath = string;

function normalizePath(pathname: string): string {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  // Map legacy aliases cleanly
  if (cleaned === '/reserve') return '/book';
  if (cleaned === '/dashboard') return '/admin/dashboard';
  if (cleaned === '/algorithms') return '/admin/algorithms';
  if (cleaned === '/agents') return '/admin/agents';
  if (cleaned === '/assistant') return '/admin/assistant';
  if (cleaned === '/scenarios') return '/admin/scenarios';
  return cleaned;
}

export function extractTableIdFromPath(path: string): string | null {
  const match = /^\/table\/([^/]+)\/menu$/i.exec(path);
  return match ? match[1].toUpperCase() : null;
}

interface RestaurantContextValue {
  currentPath: string;
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  navigate: (path: string) => void;
  tables: RestaurantTable[];
  queue: WaitingParty[];
  reservations: ReservationRecord[];
  ingredients: IngredientItem[];
  orders: KitchenOrder[];
  waiters: WaiterAgent[];
  events: AgentEvent[];
  xaiLogs: XaiAuditLog[];
  weights: AStarWeights;
  setWeights: React.Dispatch<React.SetStateAction<AStarWeights>>;
  benchmarks: AlgorithmBenchmark[];
  runBenchmarksNow: () => AlgorithmBenchmark[];
  turnoverComparison: {
    predictions: TurnoverPrediction[];
    symbolicMae: number;
    mlMae: number;
  };
  fairnessAudit: FairnessAudit;
  floorEfficiency: ReturnType<typeof computeFloorEfficiency>;
  tickCount: number;
  isAutoPlaying: boolean;
  setIsAutoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  dbConnected: boolean;
  lastLatencyMs: number;
  stepSimulationTick: () => void;
  validateAndSubmitBooking: (
    req: BookingValidationRequest,
  ) => Promise<BookingValidationResponse>;
  simulateGuestArrival: (
    bookingIdOrPartyId: string,
  ) => Promise<{ allocation: AllocationResult; responseTimeMs: number } | null>;
  placeTableOrder: (
    tableId: string,
    items: CartOrderItem[],
  ) => Promise<OrderIngredientValidationResponse>;
  advanceOrderStatus: (orderId: string) => void;
  setIngredientStock: (ingredientId: string, stock: number) => void;
  updateTableState: (
    tableId: string,
    nextStatus: TableStatus,
    nextCourse?: CourseStage,
  ) => void;
  selectedTableId: string | null;
  setSelectedTableId: React.Dispatch<React.SetStateAction<string | null>>;
  resetFloor: () => void;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/',
  );

  const portalMode: PortalMode = currentPath.startsWith('/admin')
    ? 'admin'
    : 'customer';

  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [queue, setQueue] = useState<WaitingParty[]>(INITIAL_QUEUE);
  const [reservations, setReservations] =
    useState<ReservationRecord[]>(INITIAL_RESERVATIONS);
  const [ingredients, setIngredients] =
    useState<IngredientItem[]>(INITIAL_INGREDIENTS);
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);
  const [waiters, setWaiters] = useState<WaiterAgent[]>(INITIAL_WAITERS);
  const [events, setEvents] = useState<AgentEvent[]>(INITIAL_AGENT_EVENTS);
  const [xaiLogs, setXaiLogs] = useState<XaiAuditLog[]>(INITIAL_XAI_LOGS);
  const [weights, setWeights] = useState<AStarWeights>({
    w1Waste: 1.0,
    w2Wait: 1.0,
  });
  const [benchmarks, setBenchmarks] = useState<AlgorithmBenchmark[]>(() =>
    runSearchBenchmarks(INITIAL_TABLES, INITIAL_QUEUE, {
      w1Waste: 1.0,
      w2Wait: 1.0,
    }),
  );
  const [tickCount, setTickCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState(14);
  const [selectedTableId, setSelectedTableId] = useState<string | null>('T3');

  const simRef = useRef({ tables, queue, waiters, tickCount });
  simRef.current = { tables, queue, waiters, tickCount };

  useEffect(() => {
    let active = true;
    fetchFloorStateFromApi().then((snap) => {
      if (!active || !snap) return;
      setTables(snap.tables);
      setQueue(snap.queue);
      setReservations(snap.reservations);
      setIngredients(snap.ingredients);
      setOrders(snap.orders);
      setWaiters(snap.waiters);
      setEvents(snap.events);
      setXaiLogs(snap.xaiLogs);
      setDbConnected(snap.dbConnected);
      setLastLatencyMs(snap.dbLatencyMs);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((rawPath: string) => {
    const target = normalizePath(rawPath);
    setCurrentPath(target);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== target) {
        window.history.pushState({}, '', target);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const setPortalMode = useCallback(
    (mode: PortalMode) => {
      if (mode === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    },
    [navigate],
  );

  const stepSimulationTick = useCallback(() => {
    const {
      tables: curT,
      queue: curQ,
      waiters: curW,
      tickCount: curTick,
    } = simRef.current;
    const result = stepMultiAgentSimulation(curT, curQ, curW, curTick);
    setTables(result.tables);
    setQueue(result.queue);
    setWaiters(result.waiters);
    setTickCount(curTick + 1);
    setOrders((prev) =>
      prev.map((o) =>
        o.status === 'Order Received'
          ? { ...o, status: 'Preparing' }
          : o.status === 'Preparing'
          ? { ...o, status: 'Waiter En Route' }
          : o,
      ),
    );
    if (result.newEvents.length > 0) {
      setEvents((prev) => [...result.newEvents, ...prev].slice(0, 32));
    }
    void stepSimulationTickApi(curTick);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = window.setInterval(() => {
      stepSimulationTick();
    }, 1800);
    return () => window.clearInterval(id);
  }, [isAutoPlaying, stepSimulationTick]);

  const runBenchmarksNow = useCallback(() => {
    const fresh = runSearchBenchmarks(tables, queue, weights);
    setBenchmarks(fresh);
    return fresh;
  }, [tables, queue, weights]);

  // Workflow A: Smart Booking Validation + Instant Email Pass
  const validateAndSubmitBooking = useCallback(
    async (
      req: BookingValidationRequest,
    ): Promise<BookingValidationResponse> => {
      const resp = await validateAndCreateBooking(req, tables, reservations);
      setLastLatencyMs(resp.responseTimeMs);

      if (resp.fulfillable && resp.reservation) {
        const rec = resp.reservation;
        setReservations((prev) => [rec, ...prev]);

        const newParty: WaitingParty = {
          id: `P-${rec.bookingId.replace('KK-', '')}`,
          name: rec.guestName,
          size: rec.partySize,
          isVip: rec.isVip,
          needsWheelchair: rec.needsWheelchair,
          preferredZone: rec.preferredZone,
          dietaryNotes: rec.specialRequests,
          waitMins: rec.isVip ? 11 : 2,
          status: 'WAITING',
          bookingId: rec.bookingId,
        };
        setQueue((prev) => [newParty, ...prev]);

        setXaiLogs((prev) => [
          {
            id: `xai-${Date.now()}`,
            timestamp: rec.createdAt,
            partyName: rec.guestName,
            partySize: rec.partySize,
            assignedTables: rec.assignedTableIds,
            algorithm: 'Forward-Chaining + NeonDB Lock',
            fScore: rec.fScore,
            bayesianProb: rec.bayesianConfidencePct / 100,
            rulesApplied: rec.triggeredRules,
            justification: `Booked ${rec.assignedTableIds.join(
              ' + ',
            )} (${rec.bookingId}) with email confirmation sent to ${rec.email}.`,
          },
          ...prev,
        ]);

        setEvents((prev) => [
          {
            id: `evt-bk-${Date.now()}`,
            tick: tickCount,
            timestamp: rec.createdAt,
            agentId: 'Host-01',
            agentName: 'Host-01 · Concierge',
            agentType: 'Host (Goal-Based)',
            utilityScore: 0.97,
            targetTableId: rec.assignedTableIds[0] ?? null,
            message: `Workflow A locked ${rec.assignedTableIds.join(
              ' + ',
            )} for ${rec.guestName} (${rec.bookingId}) & dispatched QR pass email (${resp.responseTimeMs}ms).`,
          },
          ...prev,
        ]);
      }

      return resp;
    },
    [tables, reservations, tickCount],
  );

  // Workflow B: Guest Arrival Check-In + A* Search Assignment + QR Activation
  const simulateGuestArrival = useCallback(
    async (
      bookingIdOrPartyId: string,
    ): Promise<{ allocation: AllocationResult; responseTimeMs: number } | null> => {
      const matchedParty = queue.find(
        (p) =>
          (p.id === bookingIdOrPartyId || p.bookingId === bookingIdOrPartyId) &&
          p.status === 'WAITING',
      );
      const matchedRes = reservations.find(
        (r) => r.bookingId === bookingIdOrPartyId,
      );

      const targetParty: WaitingParty | null =
        matchedParty ??
        (matchedRes
          ? {
              id: `P-${matchedRes.bookingId.replace('KK-', '')}`,
              name: matchedRes.guestName,
              size: matchedRes.partySize,
              isVip: matchedRes.isVip,
              needsWheelchair: matchedRes.needsWheelchair,
              preferredZone: matchedRes.preferredZone,
              dietaryNotes: matchedRes.specialRequests,
              waitMins: 0,
              status: 'WAITING',
              bookingId: matchedRes.bookingId,
            }
          : null);

      if (!targetParty) return null;

      const remaining = Math.max(
        0,
        queue.filter((p) => p.status === 'WAITING').length - 1,
      );
      const apiCheckIn = await checkInGuestViaApi(bookingIdOrPartyId, weights);
      const { result, responseTimeMs } = apiCheckIn
        ? {
            result: apiCheckIn.allocation,
            responseTimeMs: apiCheckIn.responseTimeMs,
          }
        : await allocateTableViaAStar(tables, targetParty, remaining, weights);
      setLastLatencyMs(responseTimeMs);

      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      if (result.success) {
        setTables((prev) =>
          prev.map((t) =>
            result.assignedTableIds.includes(t.id)
              ? {
                  ...t,
                  status: 'Occupied',
                  currentCourse: 'Appetizer',
                  elapsedMins: 0,
                  assignedPartyId: targetParty.id,
                  assignedPartyName: targetParty.name,
                  assignedPartySize: targetParty.size,
                  activeBookingId:
                    targetParty.bookingId ?? matchedRes?.bookingId ?? 'WALKIN',
                }
              : t,
          ),
        );

        setQueue((prev) =>
          prev.map((p) =>
            p.id === targetParty.id || p.bookingId === bookingIdOrPartyId
              ? { ...p, status: 'SEATED' }
              : p,
          ),
        );

        if (targetParty.bookingId || matchedRes) {
          const bid = targetParty.bookingId ?? matchedRes?.bookingId;
          setReservations((prev) =>
            prev.map((r) =>
              r.bookingId === bid
                ? {
                    ...r,
                    status: 'SEATED',
                    assignedTableIds: result.assignedTableIds,
                  }
                : r,
            ),
          );
        }

        setSelectedTableId(result.assignedTableIds[0] ?? null);
      }

      setXaiLogs((prev) => [
        apiCheckIn?.xaiLog ?? {
          id: `xai-arr-${Date.now()}`,
          timestamp: ts,
          partyName: targetParty.name,
          partySize: targetParty.size,
          assignedTables:
            result.assignedTableIds.length > 0
              ? result.assignedTableIds
              : ['Waitlist'],
          algorithm: 'A* Check-In Dispatch',
          fScore: result.fScore,
          bayesianProb: result.bayesianProb,
          rulesApplied:
            result.triggeredRules.length > 0
              ? result.triggeredRules
              : ['Minimal Waste Heuristic'],
          justification: result.explanation,
        },
        ...prev,
      ]);

      setEvents((prev) => [
        apiCheckIn?.agentEvent ?? {
          id: `evt-arr-${Date.now()}`,
          tick: tickCount,
          timestamp: ts,
          agentId: 'Host-01',
          agentName: 'Host-01 · Concierge',
          agentType: 'Host (Goal-Based)',
          utilityScore: 0.98,
          targetTableId: result.assignedTableIds[0] ?? null,
          message: `Guest Arrived (${targetParty.name}) → A* assigned ${result.assignedTableIds.join(
            ' + ',
          )} & activated Table QR Menu (${responseTimeMs}ms).`,
        },
        ...prev,
      ]);

      return { allocation: result, responseTimeMs };
    },
    [queue, reservations, tables, weights, tickCount],
  );

  // Workflow B: Atomic Recipe-to-Ingredient Check + Kitchen Order Dispatch
  const placeTableOrder = useCallback(
    async (
      tableId: string,
      items: CartOrderItem[],
    ): Promise<OrderIngredientValidationResponse> => {
      const tbl = tables.find((t) => t.id === tableId);
      const resp = await validateOrderIngredients(
        {
          tableId,
          bookingId: tbl?.activeBookingId ?? null,
          items,
        },
        MENU_DISHES,
        ingredients,
      );
      setLastLatencyMs(resp.responseTimeMs);

      if (resp.ok && resp.order && resp.updatedIngredients) {
        setIngredients(resp.updatedIngredients);
        setOrders((prev) => [resp.order!, ...prev]);

        const matchingWaiter =
          waiters.find(
            (w) => w.role === 'Waiter (Utility-Based)' && w.zone === tbl?.zone,
          ) ?? waiters[0];

        if (matchingWaiter) {
          setWaiters((prev) =>
            prev.map((w) =>
              w.id === matchingWaiter.id
                ? {
                    ...w,
                    currentAction: 'ServeOrder',
                    targetTableId: tableId,
                    tasksCompleted: w.tasksCompleted + 1,
                  }
                : w,
            ),
          );
        }

        setEvents((prev) => [
          {
            id: `evt-ord-${Date.now()}`,
            tick: tickCount,
            timestamp: resp.order!.createdAt,
            agentId: matchingWaiter?.id ?? 'W1',
            agentName: matchingWaiter?.name ?? 'W1 · Arjun',
            agentType: 'Waiter (Utility-Based)',
            utilityScore: 0.95,
            targetTableId: tableId,
            message: `QR Order ${resp.order!.orderId} validated in ${resp.responseTimeMs}ms → Dispatched to Kitchen & ${
              matchingWaiter?.name ?? 'Waiter'
            } for Table ${tableId}.`,
          },
          ...prev,
        ]);
      }

      return resp;
    },
    [tables, ingredients, waiters, tickCount],
  );

  const advanceOrderStatus = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId !== orderId) return o;
        const next: OrderStatus =
          o.status === 'Order Received'
            ? 'Preparing'
            : o.status === 'Preparing'
            ? 'Waiter En Route'
            : 'Waiter En Route';
        return { ...o, status: next };
      }),
    );
    void advanceOrderStatusApi(orderId);
  }, []);

  const setIngredientStock = useCallback(
    (ingredientId: string, stock: number) => {
      const clamped = Math.max(0, stock);
      setIngredients((prev) =>
        prev.map((ing) =>
          ing.id === ingredientId ? { ...ing, stock: clamped } : ing,
        ),
      );
      void updateIngredientStockApi(ingredientId, clamped);
    },
    [],
  );

  const updateTableState = useCallback(
    (tableId: string, nextStatus: TableStatus, nextCourse?: CourseStage) => {
      setTables((prev) =>
        prev.map((t) => {
          if (t.id !== tableId) return t;
          const resolvedCourse: CourseStage =
            nextCourse ??
            (nextStatus === 'Free' || nextStatus === 'Dirty'
              ? 'None'
              : nextStatus === 'Paying'
              ? 'Billing'
              : t.currentCourse === 'None'
              ? 'Mains'
              : t.currentCourse);
          return {
            ...t,
            status: nextStatus,
            currentCourse: resolvedCourse,
            elapsedMins:
              nextStatus === 'Free' || nextStatus === 'Dirty'
                ? 0
                : nextStatus === 'Paying'
                ? Math.max(50, t.elapsedMins)
                : t.elapsedMins,
            assignedPartyId:
              nextStatus === 'Free' || nextStatus === 'Dirty'
                ? null
                : t.assignedPartyId,
            assignedPartyName:
              nextStatus === 'Free' || nextStatus === 'Dirty'
                ? null
                : t.assignedPartyName,
            assignedPartySize:
              nextStatus === 'Free' || nextStatus === 'Dirty'
                ? null
                : t.assignedPartySize,
          };
        }),
      );
      void updateTableStateApi(tableId, nextStatus, nextCourse);
    },
    [],
  );

  const resetFloor = useCallback(() => {
    setIsAutoPlaying(false);
    setTables(INITIAL_TABLES);
    setQueue(INITIAL_QUEUE);
    setReservations(INITIAL_RESERVATIONS);
    setIngredients(INITIAL_INGREDIENTS);
    setOrders(INITIAL_ORDERS);
    setWaiters(INITIAL_WAITERS);
    setEvents(INITIAL_AGENT_EVENTS);
    setXaiLogs(INITIAL_XAI_LOGS);
    setTickCount(0);
    setLastLatencyMs(14);
    setBenchmarks(runSearchBenchmarks(INITIAL_TABLES, INITIAL_QUEUE, weights));
    void resetFloorApi().then((snap) => {
      if (!snap) return;
      setTables(snap.tables);
      setQueue(snap.queue);
      setReservations(snap.reservations);
      setIngredients(snap.ingredients);
      setOrders(snap.orders);
      setWaiters(snap.waiters);
      setEvents(snap.events);
      setXaiLogs(snap.xaiLogs);
      setDbConnected(snap.dbConnected);
      setLastLatencyMs(snap.dbLatencyMs);
    });
  }, [weights]);

  const turnoverComparison = useMemo(
    () => compareTurnoverModels(tables),
    [tables],
  );
  const fairnessAudit = useMemo(() => computeFairnessAudit(queue), [queue]);
  const floorEfficiency = useMemo(
    () => computeFloorEfficiency(tables),
    [tables],
  );

  const value: RestaurantContextValue = {
    currentPath,
    portalMode,
    setPortalMode,
    navigate,
    tables,
    queue,
    reservations,
    ingredients,
    orders,
    waiters,
    events,
    xaiLogs,
    weights,
    setWeights,
    benchmarks,
    runBenchmarksNow,
    turnoverComparison,
    fairnessAudit,
    floorEfficiency,
    tickCount,
    isAutoPlaying,
    setIsAutoPlaying,
    dbConnected,
    lastLatencyMs,
    stepSimulationTick,
    validateAndSubmitBooking,
    simulateGuestArrival,
    placeTableOrder,
    advanceOrderStatus,
    setIngredientStock,
    updateTableState,
    selectedTableId,
    setSelectedTableId,
    resetFloor,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error('useRestaurant must be used inside RestaurantProvider');
  }
  return ctx;
}
