import 'dotenv/config';
import express, { type Express } from 'express';
import {
  INITIAL_INGREDIENTS,
  INITIAL_QUEUE,
  INITIAL_RESERVATIONS,
  INITIAL_TABLES,
  INITIAL_WAITERS,
  MENU_DISHES,
} from './engine/data';
import {
  runAStarAllocation,
  stepMultiAgentSimulation,
} from './engine/aiEngine';
import {
  validateBookingWorkflow,
  validateOrderIngredientsWorkflow,
} from './engine/workflows';
import {
  buildGroqKnowledgeContext,
  evaluateGroundedMaitreD,
  HALLUCINATION_REFUSAL_TEXT,
  isExplicitOutOfScopeQuery,
} from './engine/ragGrounding';
import {
  checkDbHealth,
  ensureSchemaAndSeed,
  fetchFullFloorSnapshot,
  persistBookingTransaction,
  persistGuestArrivalTransaction,
  persistIngredientStockUpdate,
  persistOrderAndInventoryTransaction,
  persistOrderStatusAdvance,
  persistSimulationStep,
  persistTableStateUpdate,
  resetNeonFloorToSeed,
  seedDemoDataInDb,
} from './db/neon';
import type {
  AgentEvent,
  AStarWeights,
  BookingValidationRequest,
  CourseStage,
  IngredientItem,
  MenuDish,
  OrderIngredientValidationRequest,
  OrderStatus,
  ReservationRecord,
  RestaurantTable,
  TableStatus,
  WaitingParty,
  WaiterAgent,
  XaiAuditLog,
} from './engine/types';

interface MaitreDRequestBody {
  message?: string;
  portal?: 'customer' | 'admin';
  tables?: RestaurantTable[];
  queue?: WaitingParty[];
  waiters?: WaiterAgent[];
  ingredients?: IngredientItem[];
  reservations?: ReservationRecord[];
}

function nowTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

export function isGroqConfigured(): boolean {
  const key = (process.env.GROQ_API_KEY ?? '').trim();
  return Boolean(key && key !== 'YOUR_GROQ_API_KEY' && key !== 'MY_GROQ_API_KEY');
}

function parseGroqJsonContent(raw: string): {
  reply?: string;
  sources?: string[];
  refusalTriggered?: boolean;
} | null {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned) as {
      reply?: string;
      sources?: string[];
      refusalTriggered?: boolean;
    };
  } catch {
    const braceStart = cleaned.indexOf('{');
    const braceEnd = cleaned.lastIndexOf('}');
    if (braceStart !== -1 && braceEnd > braceStart) {
      try {
        return JSON.parse(cleaned.slice(braceStart, braceEnd + 1)) as {
          reply?: string;
          sources?: string[];
          refusalTriggered?: boolean;
        };
      } catch {
        return null;
      }
    }
    return null;
  }
}

export function createApiApp(): Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.use('/api', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get('/api/health', async (_req, res) => {
    await ensureSchemaAndSeed().catch(() => false);
    const health = await checkDbHealth();
    res.json({
      ok: true,
      service: 'khana-khazana-dual-portal',
      dbConnected: health.connected,
      dbLatencyMs: health.latencyMs,
      database: 'neondb',
      groqConfigured: isGroqConfigured(),
      groqModel: 'openai/gpt-oss-120b',
    });
  });

  // Full Floor & Telemetry Snapshot from NeonDB
  app.get('/api/floor/state', async (_req, res) => {
    try {
      const snap = await fetchFullFloorSnapshot();
      if (!snap) {
        res.status(503).json({
          ok: false,
          error: 'NeonDB connection unavailable.',
        });
        return;
      }
      res.json({ ok: true, ...snap });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to fetch floor state',
      });
    }
  });

  // Workflow A: Smart Booking Validation, NeonDB Lock & Email Pass Dispatch
  app.post('/api/bookings/validate', async (req, res) => {
    const t0 = performance.now();
    const body = (req.body ?? {}) as {
      request?: BookingValidationRequest;
      tables?: RestaurantTable[];
      reservations?: ReservationRecord[];
    };
    if (!body.request) {
      res.status(400).json({ error: 'Invalid booking validation payload.' });
      return;
    }

    try {
      const snap = await fetchFullFloorSnapshot();
      const liveTables =
        snap?.tables ??
        (Array.isArray(body.tables) && body.tables.length > 0
          ? body.tables
          : INITIAL_TABLES);
      const liveReservations =
        snap?.reservations ??
        (Array.isArray(body.reservations)
          ? body.reservations
          : INITIAL_RESERVATIONS);

      const result = validateBookingWorkflow(
        body.request,
        liveTables,
        liveReservations,
      );

      let persistedToDb = false;

      if (result.fulfillable && result.reservation) {
        const rec = result.reservation;
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
        const newXaiLog: XaiAuditLog = {
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
        };
        const newEvent: AgentEvent = {
          id: `evt-bk-${Date.now()}`,
          tick: 0,
          timestamp: rec.createdAt,
          agentId: 'Host-01',
          agentName: 'Host-01 · Concierge',
          agentType: 'Host (Goal-Based)',
          utilityScore: 0.97,
          targetTableId: rec.assignedTableIds[0] ?? null,
          message: `Workflow A locked ${rec.assignedTableIds.join(
            ' + ',
          )} for ${rec.guestName} (${rec.bookingId}) in NeonDB.`,
        };

        if (snap) {
          await persistBookingTransaction({
            reservation: rec,
            party: newParty,
            xaiLog: newXaiLog,
            agentEvent: newEvent,
          });
          persistedToDb = true;
        }
      }

      res.json({
        ...result,
        persistedToDb,
        responseTimeMs: Math.max(25, Math.round(performance.now() - t0)),
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Booking validation failed',
      });
    }
  });

  // Workflow B (Part 2): Guest Arrival Check-In + A* Allocation + NeonDB Persistence
  app.post('/api/bookings/check-in', async (req, res) => {
    const t0 = performance.now();
    const body = (req.body ?? {}) as {
      bookingIdOrPartyId?: string;
      weights?: AStarWeights;
    };
    if (!body.bookingIdOrPartyId) {
      res.status(400).json({ error: 'bookingIdOrPartyId is required.' });
      return;
    }

    try {
      const snap = await fetchFullFloorSnapshot();
      if (!snap) {
        res.status(503).json({ error: 'NeonDB connection unavailable.' });
        return;
      }

      const idOrBooking = body.bookingIdOrPartyId;
      const matchedParty = snap.queue.find(
        (p) =>
          (p.id === idOrBooking || p.bookingId === idOrBooking) &&
          p.status === 'WAITING',
      );
      const matchedRes = snap.reservations.find(
        (r) => r.bookingId === idOrBooking,
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

      if (!targetParty) {
        res.status(404).json({ error: 'Party or reservation not found.' });
        return;
      }

      const remaining = Math.max(
        0,
        snap.queue.filter((p) => p.status === 'WAITING').length - 1,
      );
      const allocation = runAStarAllocation(
        snap.tables,
        targetParty,
        remaining,
        body.weights,
      );
      const ts = nowTimeString();
      const responseTimeMs = Math.max(25, Math.round(performance.now() - t0));

      const xaiLog: XaiAuditLog = {
        id: `xai-arr-${Date.now()}`,
        timestamp: ts,
        partyName: targetParty.name,
        partySize: targetParty.size,
        assignedTables:
          allocation.assignedTableIds.length > 0
            ? allocation.assignedTableIds
            : ['Waitlist'],
        algorithm: 'A* Check-In Dispatch',
        fScore: allocation.fScore,
        bayesianProb: allocation.bayesianProb,
        rulesApplied:
          allocation.triggeredRules.length > 0
            ? allocation.triggeredRules
            : ['Minimal Waste Heuristic'],
        justification: allocation.explanation,
      };

      const agentEvent: AgentEvent = {
        id: `evt-arr-${Date.now()}`,
        tick: 0,
        timestamp: ts,
        agentId: 'Host-01',
        agentName: 'Host-01 · Concierge',
        agentType: 'Host (Goal-Based)',
        utilityScore: 0.98,
        targetTableId: allocation.assignedTableIds[0] ?? null,
        message: `Guest Arrived (${targetParty.name}) → A* assigned ${allocation.assignedTableIds.join(
          ' + ',
        )} & synced NeonDB (${responseTimeMs}ms).`,
      };

      if (allocation.success) {
        await persistGuestArrivalTransaction({
          assignedTableIds: allocation.assignedTableIds,
          party: targetParty,
          bookingId: targetParty.bookingId ?? matchedRes?.bookingId ?? null,
          xaiLog,
          agentEvent,
        });
      }

      res.json({
        allocation,
        responseTimeMs,
        persistedToDb: allocation.success,
        xaiLog,
        agentEvent,
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Check-in failed',
      });
    }
  });

  // Workflow B (Part 1): Atomic Recipe-to-Ingredient Inventory Verification + NeonDB Deduction
  app.post('/api/orders/validate-ingredients', async (req, res) => {
    const t0 = performance.now();
    const body = (req.body ?? {}) as {
      request?: OrderIngredientValidationRequest;
      menuDishes?: MenuDish[];
      ingredients?: IngredientItem[];
    };
    if (!body.request) {
      res.status(400).json({ error: 'Invalid order inventory payload.' });
      return;
    }

    try {
      const snap = await fetchFullFloorSnapshot();
      const liveDishes =
        snap?.menuDishes && snap.menuDishes.length > 0
          ? snap.menuDishes
          : Array.isArray(body.menuDishes) && body.menuDishes.length > 0
          ? body.menuDishes
          : MENU_DISHES;
      const liveIngredients =
        snap?.ingredients ??
        (Array.isArray(body.ingredients) && body.ingredients.length > 0
          ? body.ingredients
          : INITIAL_INGREDIENTS);

      const result = validateOrderIngredientsWorkflow(
        body.request,
        liveDishes,
        liveIngredients,
      );

      if (result.ok && result.order && result.updatedIngredients && snap) {
        const tbl = snap.tables.find((t) => t.id === body.request!.tableId);
        const matchingWaiter =
          snap.waiters.find(
            (w) => w.role === 'Waiter (Utility-Based)' && w.zone === tbl?.zone,
          ) ?? snap.waiters[0];

        result.order.dispatchedAgentId = matchingWaiter?.id ?? 'W1';
        const responseTimeMs = Math.max(25, Math.round(performance.now() - t0));

        const agentEvent: AgentEvent = {
          id: `evt-ord-${Date.now()}`,
          tick: 0,
          timestamp: result.order.createdAt,
          agentId: matchingWaiter?.id ?? 'W1',
          agentName: matchingWaiter?.name ?? 'W1 · Arjun',
          agentType: 'Waiter (Utility-Based)',
          utilityScore: 0.95,
          targetTableId: body.request.tableId,
          message: `QR Order ${result.order.orderId} committed atomically in NeonDB (${responseTimeMs}ms) → Dispatched to ${
            matchingWaiter?.name ?? 'Waiter'
          } for ${body.request.tableId}.`,
        };

        await persistOrderAndInventoryTransaction({
          order: result.order,
          updatedIngredients: result.updatedIngredients,
          waiterId: matchingWaiter?.id ?? 'W1',
          agentEvent,
        });

        res.json({
          ...result,
          persistedToDb: true,
          responseTimeMs,
          agentEvent,
        });
        return;
      }

      res.json({
        ...result,
        persistedToDb: false,
        responseTimeMs: Math.max(20, Math.round(performance.now() - t0)),
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Order validation failed',
      });
    }
  });

  app.patch('/api/orders/:orderId/advance', async (req, res) => {
    try {
      const snap = await fetchFullFloorSnapshot();
      const target = snap?.orders.find((o) => o.orderId === req.params.orderId);
      if (!target) {
        res.status(404).json({ error: 'Order not found.' });
        return;
      }
      const nextStatus: OrderStatus =
        target.status === 'Order Received'
          ? 'Preparing'
          : target.status === 'Preparing'
          ? 'Waiter En Route'
          : 'Waiter En Route';
      const updated = await persistOrderStatusAdvance(
        req.params.orderId,
        nextStatus,
      );
      res.json({ ok: true, order: updated });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to advance order',
      });
    }
  });

  app.patch('/api/ingredients/:id', async (req, res) => {
    const body = (req.body ?? {}) as { stock?: number };
    if (typeof body.stock !== 'number' || Number.isNaN(body.stock)) {
      res.status(400).json({ error: 'Numeric stock value required.' });
      return;
    }
    try {
      const updated = await persistIngredientStockUpdate(
        req.params.id,
        body.stock,
      );
      if (!updated) {
        res.status(404).json({ error: 'Ingredient not found.' });
        return;
      }
      res.json({ ok: true, ingredient: updated });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Stock update failed',
      });
    }
  });

  app.patch('/api/tables/:id', async (req, res) => {
    const body = (req.body ?? {}) as {
      status?: TableStatus;
      course?: CourseStage;
    };
    if (!body.status) {
      res.status(400).json({ error: 'status is required.' });
      return;
    }
    try {
      const snap = await fetchFullFloorSnapshot();
      const current = snap?.tables.find((t) => t.id === req.params.id);
      if (!current) {
        res.status(404).json({ error: 'Table not found.' });
        return;
      }
      const resolvedCourse: CourseStage =
        body.course ??
        (body.status === 'Free' || body.status === 'Dirty'
          ? 'None'
          : body.status === 'Paying'
          ? 'Billing'
          : current.currentCourse === 'None'
          ? 'Mains'
          : current.currentCourse);

      const clearParty = body.status === 'Free' || body.status === 'Dirty';
      const elapsedMins = clearParty
        ? 0
        : body.status === 'Paying'
        ? Math.max(50, current.elapsedMins)
        : current.elapsedMins;

      const updated = await persistTableStateUpdate({
        tableId: req.params.id,
        status: body.status,
        currentCourse: resolvedCourse,
        elapsedMins,
        clearParty,
      });
      res.json({ ok: true, table: updated });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Table update failed',
      });
    }
  });

  app.post('/api/simulation/tick', async (req, res) => {
    const body = (req.body ?? {}) as { tickCount?: number };
    try {
      const snap = await fetchFullFloorSnapshot();
      if (!snap) {
        res.status(503).json({ error: 'NeonDB connection unavailable.' });
        return;
      }
      const tickCount =
        typeof body.tickCount === 'number' ? body.tickCount : 0;
      const sim = stepMultiAgentSimulation(
        snap.tables,
        snap.queue,
        snap.waiters,
        tickCount,
      );
      await persistSimulationStep(sim);
      res.json({ ok: true, ...sim });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Simulation step failed',
      });
    }
  });

  app.post('/api/floor/reset', async (_req, res) => {
    try {
      const snap = await resetNeonFloorToSeed();
      if (!snap) {
        res.status(503).json({ error: 'NeonDB connection unavailable.' });
        return;
      }
      res.json({ ok: true, ...snap });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Floor reset failed',
      });
    }
  });

  app.post('/api/floor/seed-demo', async (_req, res) => {
    try {
      const seedRes = await seedDemoDataInDb();
      if (!seedRes.ok) {
        res.status(503).json({ error: 'NeonDB connection unavailable.' });
        return;
      }
      const snap = await fetchFullFloorSnapshot();
      res.json({
        ok: true,
        insertedCounts: seedRes.insertedCounts,
        snapshot: snap,
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Demo data seed failed',
      });
    }
  });

  // Standalone A* Allocation endpoint
  app.post('/api/ai/allocate-table', (req, res) => {
    const body = (req.body ?? {}) as {
      tables?: RestaurantTable[];
      party?: WaitingParty;
      remainingQueueCount?: number;
      weights?: AStarWeights;
    };
    if (!Array.isArray(body.tables) || !body.party) {
      res.status(400).json({ error: 'Invalid table allocation payload.' });
      return;
    }
    const result = runAStarAllocation(
      body.tables,
      body.party,
      typeof body.remainingQueueCount === 'number' ? body.remainingQueueCount : 0,
      body.weights,
    );
    res.json({ result });
  });

  // Grounded Groq Cloud API (openai/gpt-oss-120b) + Deterministic RAG Fallback
  async function handleGroundedAssistantRequest(
    body: MaitreDRequestBody,
  ): Promise<{
    reply: string;
    sources: string[];
    refusalTriggered: boolean;
    grounded: boolean;
    latencyMs: number;
    model: string;
    provider: 'groq' | 'grounded-simulator';
  }> {
    const t0 = performance.now();
    const userMessage =
      typeof body.message === 'string' ? body.message.trim() : '';
    const portal = body.portal === 'customer' ? 'customer' : 'admin';

    const snap = await fetchFullFloorSnapshot().catch(() => null);
    const tables =
      snap?.tables ??
      (Array.isArray(body.tables) && body.tables.length > 0
        ? body.tables
        : INITIAL_TABLES);
    const queue =
      snap?.queue ??
      (Array.isArray(body.queue) && body.queue.length > 0
        ? body.queue
        : INITIAL_QUEUE);
    const waiters =
      snap?.waiters ??
      (Array.isArray(body.waiters) && body.waiters.length > 0
        ? body.waiters
        : INITIAL_WAITERS);
    const ingredients =
      snap?.ingredients ??
      (Array.isArray(body.ingredients) && body.ingredients.length > 0
        ? body.ingredients
        : INITIAL_INGREDIENTS);
    const reservations =
      snap?.reservations ??
      (Array.isArray(body.reservations) && body.reservations.length > 0
        ? body.reservations
        : INITIAL_RESERVATIONS);

    // Fast guardrail short-circuit ONLY for explicit out-of-scope traps
    if (isExplicitOutOfScopeQuery(userMessage)) {
      return {
        reply: HALLUCINATION_REFUSAL_TEXT,
        sources: ['[restaurant_policies.md]', '[live_floor_db]'],
        refusalTriggered: true,
        grounded: true,
        latencyMs: Math.max(12, Math.round(performance.now() - t0)),
        model: 'openai/gpt-oss-120b',
        provider: isGroqConfigured() ? 'groq' : 'grounded-simulator',
      };
    }

    const groqApiKey = (process.env.GROQ_API_KEY ?? '').trim();
    if (isGroqConfigured()) {
      try {
        const ragContext = buildGroqKnowledgeContext({
          portal,
          tables,
          queue,
          waiters,
          ingredients,
          reservations,
        });

        const systemPrompt = `You are the Grounded AI ${
          portal === 'customer' ? 'Concierge' : "Maître D'"
        } for Khana-Khazana ("Where Culinary Heritage Meets Autonomous Intelligence").
INSTRUCTIONS:
1. If the user greets you or asks who you are / what you can help with (e.g. "hi", "hello", "who are you"), warmly introduce yourself as the Khana-Khazana AI ${
          portal === 'customer' ? 'Concierge' : "Maître D'"
        } powered by Groq (openai/gpt-oss-120b), mention our operating hours (11:30 AM – 11:30 PM), dining zones (Window, Main Hall, VIP Lounge), and invite questions about live tables, wheelchair accessibility (T3+T4), allergens, or live kitchen stock. Set "refusalTriggered": false.
2. Answer restaurant questions concisely (2-3 clear sentences) and politely using ONLY the injected Restaurant Knowledge Base and Live Floor & Kitchen State below. Cite exact table IDs (T1-T10), dish prices/allergens, or live gram/unit ingredient stock counts whenever relevant.
3. If asked about ANYTHING outside Khana-Khazana or unverified in the context below (e.g., rooftop pool, spa, hotel rooms, weather, stock market, general trivia), reply strictly verbatim with:
"${HALLUCINATION_REFUSAL_TEXT}" and set "refusalTriggered": true.
4. Always respond with a valid JSON object: {"reply": string, "sources": string[], "refusalTriggered": boolean} where "sources" uses ["[restaurant_policies.md]", "[live_floor_db]"].

${ragContext}`;

        const controller = new AbortController();
        const timeoutHandle = setTimeout(() => controller.abort(), 9000);

        const groqResp = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: 'openai/gpt-oss-120b',
              temperature: 0.1,
              response_format: { type: 'json_object' },
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
              ],
            }),
            signal: controller.signal,
          },
        ).finally(() => clearTimeout(timeoutHandle));

        if (!groqResp.ok) {
          const errText = await groqResp.text().catch(() => '');
          throw new Error(`Groq HTTP ${groqResp.status}: ${errText.slice(0, 120)}`);
        }

        const completion = (await groqResp.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const rawContent = completion.choices?.[0]?.message?.content?.trim() ?? '';
        const parsed = parseGroqJsonContent(rawContent);

        if (parsed?.reply && typeof parsed.reply === 'string') {
          const isRefusal =
            Boolean(parsed.refusalTriggered) ||
            parsed.reply.trim() === HALLUCINATION_REFUSAL_TEXT;
          return {
            reply: isRefusal ? HALLUCINATION_REFUSAL_TEXT : parsed.reply.trim(),
            sources:
              Array.isArray(parsed.sources) && parsed.sources.length > 0
                ? parsed.sources
                : ['[restaurant_policies.md]', '[live_floor_db]'],
            refusalTriggered: isRefusal,
            grounded: true,
            latencyMs: Math.max(25, Math.round(performance.now() - t0)),
            model: 'openai/gpt-oss-120b',
            provider: 'groq',
          };
        }

        if (rawContent) {
          const isRefusal = rawContent === HALLUCINATION_REFUSAL_TEXT;
          return {
            reply: rawContent,
            sources: ['[restaurant_policies.md]', '[live_floor_db]'],
            refusalTriggered: isRefusal,
            grounded: true,
            latencyMs: Math.max(25, Math.round(performance.now() - t0)),
            model: 'openai/gpt-oss-120b',
            provider: 'groq',
          };
        }
      } catch (err) {
        console.warn('Groq inference failed, falling back to deterministic RAG:', err);
      }
    }

    const deterministicCheck = evaluateGroundedMaitreD(
      userMessage,
      tables,
      queue,
      waiters,
      ingredients,
      reservations,
    );

    return {
      reply: deterministicCheck.reply,
      sources: deterministicCheck.sources,
      refusalTriggered: deterministicCheck.refusalTriggered,
      grounded: true,
      latencyMs: Math.max(18, Math.round(performance.now() - t0)),
      model: 'openai/gpt-oss-120b',
      provider: 'grounded-simulator',
    };
  }

  app.post('/api/groq/chat', async (req, res) => {
    const body = (req.body ?? {}) as MaitreDRequestBody;
    if (typeof body.message !== 'string' || !body.message.trim()) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }
    const result = await handleGroundedAssistantRequest(body);
    res.json(result);
  });

  app.post('/api/maitre-d', async (req, res) => {
    const body = (req.body ?? {}) as MaitreDRequestBody;
    if (typeof body.message !== 'string' || !body.message.trim()) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }
    const result = await handleGroundedAssistantRequest(body);
    res.json(result);
  });

  return app;
}
