import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  MENU_DISHES,
  RESTAURANT_POLICIES,
  RESTAURANT_POLICIES_CHUNKS,
} from './src/engine/data';
import {
  computeBayesianTurnoverProb,
  runAStarAllocation,
} from './src/engine/aiEngine';
import {
  validateBookingWorkflow,
  validateOrderIngredientsWorkflow,
} from './src/engine/workflows';
import {
  evaluateGroundedMaitreD,
  HALLUCINATION_REFUSAL_TEXT,
} from './src/engine/ragGrounding';
import type {
  AStarWeights,
  BookingValidationRequest,
  IngredientItem,
  MenuDish,
  OrderIngredientValidationRequest,
  ReservationRecord,
  RestaurantTable,
  WaitingParty,
  WaiterAgent,
} from './src/engine/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

interface MaitreDRequestBody {
  message?: string;
  portal?: 'customer' | 'admin';
  tables?: RestaurantTable[];
  queue?: WaitingParty[];
  waiters?: WaiterAgent[];
  ingredients?: IngredientItem[];
  reservations?: ReservationRecord[];
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'khana-khajana-dual-portal' });
  });

  // Workflow A: Smart Booking Validation & Email Pass Dispatch
  app.post('/api/bookings/validate', (req, res) => {
    const body = (req.body ?? {}) as {
      request?: BookingValidationRequest;
      tables?: RestaurantTable[];
      reservations?: ReservationRecord[];
    };
    if (!body.request || !Array.isArray(body.tables)) {
      res.status(400).json({ error: 'Invalid booking validation payload.' });
      return;
    }
    const result = validateBookingWorkflow(
      body.request,
      body.tables,
      Array.isArray(body.reservations) ? body.reservations : [],
    );
    res.json(result);
  });

  // Workflow B: Atomic Recipe-to-Ingredient Inventory Verification
  app.post('/api/orders/validate-ingredients', (req, res) => {
    const body = (req.body ?? {}) as {
      request?: OrderIngredientValidationRequest;
      menuDishes?: MenuDish[];
      ingredients?: IngredientItem[];
    };
    if (!body.request || !Array.isArray(body.ingredients)) {
      res.status(400).json({ error: 'Invalid order inventory payload.' });
      return;
    }
    const result = validateOrderIngredientsWorkflow(
      body.request,
      Array.isArray(body.menuDishes) && body.menuDishes.length > 0
        ? body.menuDishes
        : MENU_DISHES,
      body.ingredients,
    );
    res.json(result);
  });

  // Workflow B: Guest Arrival A* Table Allocation
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

  // Grounded RAG Assistant (Customer AI Concierge + Admin Grounded Maître D')
  app.post('/api/maitre-d', async (req, res) => {
    const body = (req.body ?? {}) as MaitreDRequestBody;
    const userMessage =
      typeof body.message === 'string' ? body.message.trim() : '';
    const portal = body.portal === 'customer' ? 'customer' : 'admin';
    const tables = Array.isArray(body.tables) ? body.tables : [];
    const queue = Array.isArray(body.queue) ? body.queue : [];
    const waiters = Array.isArray(body.waiters) ? body.waiters : [];
    const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
    const reservations = Array.isArray(body.reservations)
      ? body.reservations
      : [];

    if (!userMessage) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const deterministicCheck = evaluateGroundedMaitreD(
      userMessage,
      tables,
      queue,
      waiters,
      ingredients,
      reservations,
    );
    if (deterministicCheck.refusalTriggered) {
      res.json({
        reply: HALLUCINATION_REFUSAL_TEXT,
        sources: deterministicCheck.sources,
        refusalTriggered: true,
        grounded: true,
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json({
        reply: deterministicCheck.reply,
        sources: deterministicCheck.sources,
        refusalTriggered: false,
        grounded: true,
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const floorSnapshot = {
        portalRole:
          portal === 'customer'
            ? 'Warm Guest Concierge (Menu, Allergens, Wait Times & Accessibility)'
            : 'Executive Admin AI Operations Maître D’ (Tables, Reservations, Inventory & Agents)',
        tables: tables.map((t) => ({
          id: t.id,
          label: t.label,
          capacity: t.capacity,
          zone: t.zone,
          isAccessible: t.isAccessible,
          isVipBooth: t.isVipBooth,
          combinableWith: t.combinableWith,
          status: t.status,
          currentCourse: t.currentCourse,
          elapsedMins: t.elapsedMins,
          bayesianFreeIn10Pct: Math.round(
            computeBayesianTurnoverProb(t.status, t.currentCourse, t.elapsedMins) *
              100,
          ),
        })),
        waitingQueue: queue.filter((p) => p.status === 'WAITING'),
        reservationsCount: reservations.length,
        inventory: ingredients.map((i) => ({
          name: i.name,
          stock: `${i.stock}${i.unit}`,
        })),
        menuDishes: MENU_DISHES.map((d) => ({
          name: d.name,
          price: d.price,
          dietaryTags: d.dietaryTags,
          prepMins: d.prepMins,
        })),
        policiesSummary: RESTAURANT_POLICIES,
        policyChunks: RESTAURANT_POLICIES_CHUNKS,
      };

      const systemInstruction = `You are the Grounded AI ${
        portal === 'customer' ? 'Concierge' : "Maître D'"
      } for Khana-Khajana ("Where Culinary Heritage Meets Autonomous Intelligence").
STRICT GROUNDING RULES:
1. Answer ONLY using facts present in the LIVE GROUNDED CONTEXT below.
2. Cite concrete table IDs (T1-T10), dish dietary tags, exact ingredient stock counts, or policy IDs (POL-01..POL-05) when relevant.
3. If a question asks about anything NOT verified in the live floor JSON, kitchen inventory, or restaurant policies (for example: rooftop swimming pool, spa, helipad, weather, external prices, hotel rooms), respond VERBATIM with: "${HALLUCINATION_REFUSAL_TEXT}"
4. Keep replies concise (2-3 crisp sentences) and warm.

LIVE GROUNDED CONTEXT:
${JSON.stringify(floorSnapshot)}`;

      const aiPromise = ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: userMessage,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              sources: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              refusalTriggered: { type: Type.BOOLEAN },
            },
            required: ['reply', 'sources', 'refusalTriggered'],
          },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 3500),
      );

      const response = await Promise.race([aiPromise, timeoutPromise]);
      const parsed = JSON.parse((response.text ?? '{}').trim()) as {
        reply?: string;
        sources?: string[];
        refusalTriggered?: boolean;
      };

      if (parsed.reply) {
        res.json({
          reply: parsed.reply,
          sources:
            Array.isArray(parsed.sources) && parsed.sources.length > 0
              ? parsed.sources
              : ['Floor State Snapshot'],
          refusalTriggered: Boolean(parsed.refusalTriggered),
          grounded: true,
        });
        return;
      }

      res.json({
        reply: deterministicCheck.reply,
        sources: deterministicCheck.sources,
        refusalTriggered: deterministicCheck.refusalTriggered,
        grounded: true,
      });
    } catch {
      res.json({
        reply: deterministicCheck.reply,
        sources: deterministicCheck.sources,
        refusalTriggered: deterministicCheck.refusalTriggered,
        grounded: true,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Khana-Khajana server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
