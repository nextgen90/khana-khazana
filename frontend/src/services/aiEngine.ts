/**
 * Unified AI Engine Client Service (`services/aiEngine.ts`)
 *
 * Connects Customer Booking (/book), QR Menu (/table/:tableId/menu),
 * Admin Floor Command (/admin/dashboard), Search & ML Lab (/admin/algorithms),
 * Multi-Agent Dispatch (/admin/agents), and Grounded Groq Concierge (/concierge & /admin/assistant)
 * to our backend API with seamless deterministic local execution fallbacks.
 */

export {
  advanceOrderStatusApi,
  allocateTableViaAStar,
  checkInGuestViaApi,
  fetchFloorStateFromApi,
  queryMaitreDRag,
  resetFloorApi,
  stepSimulationTickApi,
  updateIngredientStockApi,
  updateTableStateApi,
  validateAndCreateBooking,
  validateOrderIngredients,
} from '../api/backendService';

export type { HydratedFloorPayload } from '../api/backendService';

export {
  buildGroqKnowledgeContext,
  fetchGroqHealthStatus,
  HALLUCINATION_REFUSAL_TEXT,
  queryGroqAssistant,
} from './groqAssistant';

export type {
  GroqAssistantQueryParams,
  GroqAssistantResponse,
  GroqHealthStatus,
} from './groqAssistant';
