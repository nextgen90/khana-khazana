import type {
  IngredientItem,
  MaitreDMessage,
  ReservationRecord,
  RestaurantTable,
  WaitingParty,
  WaiterAgent,
} from '../../../backend/engine/types';
import {
  buildGroqKnowledgeContext,
  evaluateGroundedMaitreD,
  HALLUCINATION_REFUSAL_TEXT,
} from '../../../backend/engine/ragGrounding';
import { resolveApiUrl } from '../api/backendService';

export interface GroqAssistantQueryParams {
  message: string;
  portal: 'customer' | 'admin';
  tables: RestaurantTable[];
  queue: WaitingParty[];
  waiters: WaiterAgent[];
  ingredients: IngredientItem[];
  reservations: ReservationRecord[];
}

export interface GroqAssistantResponse
  extends Pick<
    MaitreDMessage,
    'content' | 'sources' | 'refusalTriggered' | 'latencyMs' | 'model' | 'provider'
  > {
  grounded: boolean;
}

export interface GroqHealthStatus {
  groqConfigured: boolean;
  groqModel: string;
  dbConnected: boolean;
}

export async function fetchGroqHealthStatus(): Promise<GroqHealthStatus> {
  try {
    const resp = await fetch(resolveApiUrl('/api/health'));
    if (!resp.ok) {
      return {
        groqConfigured: false,
        groqModel: 'openai/gpt-oss-120b',
        dbConnected: false,
      };
    }
    const data = (await resp.json()) as {
      groqConfigured?: boolean;
      groqModel?: string;
      dbConnected?: boolean;
    };
    return {
      groqConfigured: Boolean(data.groqConfigured),
      groqModel: data.groqModel ?? 'openai/gpt-oss-120b',
      dbConnected: Boolean(data.dbConnected),
    };
  } catch {
    return {
      groqConfigured: false,
      groqModel: 'openai/gpt-oss-120b',
      dbConnected: false,
    };
  }
}

export async function queryGroqAssistant(
  params: GroqAssistantQueryParams,
): Promise<GroqAssistantResponse> {
  const t0 = performance.now();

  try {
    const resp = await fetch(resolveApiUrl('/api/groq/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (resp.ok) {
      const data = (await resp.json()) as {
        reply?: string;
        sources?: string[];
        refusalTriggered?: boolean;
        latencyMs?: number;
        model?: string;
        provider?: 'groq' | 'grounded-simulator';
        grounded?: boolean;
      };

      return {
        content: data.reply ?? HALLUCINATION_REFUSAL_TEXT,
        sources:
          Array.isArray(data.sources) && data.sources.length > 0
            ? data.sources
            : ['[restaurant_policies.md]', '[live_floor_db]'],
        refusalTriggered: Boolean(data.refusalTriggered),
        latencyMs: Math.max(
          15,
          Math.round(data.latencyMs ?? performance.now() - t0),
        ),
        model: data.model ?? 'openai/gpt-oss-120b',
        provider: data.provider ?? 'grounded-simulator',
        grounded: data.grounded ?? true,
      };
    }
  } catch {
    // Graceful local deterministic RAG fallback when running offline
  }

  const localResult = evaluateGroundedMaitreD(
    params.message,
    params.tables,
    params.queue,
    params.waiters,
    params.ingredients,
    params.reservations,
  );

  return {
    content: localResult.reply,
    sources: localResult.sources,
    refusalTriggered: localResult.refusalTriggered,
    latencyMs: Math.max(12, Math.round(performance.now() - t0)),
    model: 'openai/gpt-oss-120b',
    provider: 'grounded-simulator',
    grounded: true,
  };
}

export { buildGroqKnowledgeContext, HALLUCINATION_REFUSAL_TEXT };
