import React, { useState } from 'react';
import {
  Database,
  FileText,
  MessageSquareText,
  Send,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { queryMaitreDRag } from '../api/backendService';
import { RESTAURANT_POLICIES_CHUNKS } from '../engine/data';
import type { MaitreDMessage } from '../engine/types';
import { LateralSlideCard, RaindropHeader } from '../components/MotionPrimitives';

const CUSTOMER_CHIPS = [
  'Which dishes are gluten-free?',
  'Is Truffle Paneer Tikka in stock?',
  'Which tables are wheelchair accessible right now?',
  'Do you have a rooftop swimming pool?',
];

const ADMIN_CHIPS = [
  'Which tables are wheelchair accessible right now?',
  'Is Black Truffle Shavings in stock?',
  'When can you seat a party of 7 in the Main Hall?',
  'Do you have a rooftop swimming pool?',
];

export function AssistantPage() {
  const { portalMode, tables, queue, waiters, ingredients, reservations } =
    useRestaurant();

  const isCustomer = portalMode === 'customer';
  const [inspectorTab, setInspectorTab] = useState<
    'policies' | 'inventory' | 'json'
  >('policies');
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<MaitreDMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: isCustomer
        ? 'Welcome to Khana-Khajana. I am your AI Concierge grounded in our live kitchen pantry, menu allergens, seating availability, and dining policies.'
        : 'Welcome to Floor Command. I am the Grounded AI Maître D’ inspecting live T1–T10 telemetry, NeonDB reservations, kitchen inventory, and restaurant_policies.md.',
      sources: ['Floor State Snapshot', 'Policy Doc: restaurant_policies.md'],
      timestamp: 'Live',
    },
  ]);

  const activeChips = isCustomer ? CUSTOMER_CHIPS : ADMIN_CHIPS;

  const sendQuery = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes(),
    ).padStart(2, '0')}`;

    const userMsg: MaitreDMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      sources: [],
      timestamp: ts,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const result = await queryMaitreDRag({
        message: trimmed,
        portal: portalMode,
        tables,
        queue,
        waiters,
        ingredients,
        reservations,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: result.content,
          sources: result.sources,
          refusalTriggered: result.refusalTriggered,
          timestamp: ts,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            'I cannot verify that information from the current floor data or restaurant policies.',
          sources: ['Floor State Snapshot'],
          refusalTriggered: true,
          timestamp: ts,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="overflow-x-clip bg-[#F5EFE6] text-[#111827] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <RaindropHeader
          asPageTitle
          kicker={
            isCustomer
              ? 'Customer Portal · Grounded AI Concierge'
              : 'Admin Command · Grounded Nemotron RAG'
          }
          title={
            isCustomer
              ? 'AI Guest Concierge & Allergen Guide'
              : 'Zero-Hallucination AI Maître D’ & Context Inspector'
          }
          subtitle="Every answer retrieves directly from live T1–T10 floor state, NeonDB kitchen inventory, and restaurant_policies.md—strictly refusing unverifiable claims."
        />
      </div>

      <section className="border-y border-[#DCD0BE] bg-[#F5EFE6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 lg:divide-x divide-[#DCD0BE] items-stretch">
          {/* Left: Live RAG Context Inspector */}
          <LateralSlideCard
            index={0}
            className="lg:col-span-5 px-4 sm:px-6 lg:px-8 py-10 space-y-5 bg-[#ECE3D3]"
          >
            <div className="flex items-center justify-between border-b border-[#DCD0BE] pb-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#111827]">
                  Live Grounding Context
                </h2>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Real-time policy, inventory, and floor snapshots attached to every query.
                </p>
              </div>
              <Database className="w-5 h-5 text-[#059669]" />
            </div>

            <div className="flex items-center gap-6 border-b border-[#DCD0BE]">
              <button
                type="button"
                onClick={() => setInspectorTab('policies')}
                className={`pb-2.5 font-mono text-xs font-semibold border-b-2 transition-colors ${
                  inspectorTab === 'policies'
                    ? 'border-[#DC2626] text-[#DC2626]'
                    : 'border-transparent text-neutral-500 hover:text-[#111827]'
                }`}
              >
                Policies
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('inventory')}
                className={`pb-2.5 font-mono text-xs font-semibold border-b-2 transition-colors ${
                  inspectorTab === 'inventory'
                    ? 'border-[#DC2626] text-[#DC2626]'
                    : 'border-transparent text-neutral-500 hover:text-[#111827]'
                }`}
              >
                Live Pantry
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('json')}
                className={`pb-2.5 font-mono text-xs font-semibold border-b-2 transition-colors ${
                  inspectorTab === 'json'
                    ? 'border-[#DC2626] text-[#DC2626]'
                    : 'border-transparent text-neutral-500 hover:text-[#111827]'
                }`}
              >
                Floor JSON
              </button>
            </div>

            {inspectorTab === 'policies' ? (
              <div className="divide-y divide-[#DCD0BE] max-h-[440px] overflow-y-auto pr-1">
                {RESTAURANT_POLICIES_CHUNKS.map((chunk) => (
                  <div key={chunk.id} className="py-3.5 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#DC2626] font-semibold flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {chunk.id} · {chunk.section}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {chunk.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : inspectorTab === 'inventory' ? (
              <div className="divide-y divide-[#DCD0BE] max-h-[440px] overflow-y-auto pr-1">
                {ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="py-3 first:pt-0 flex items-center justify-between text-xs gap-2"
                  >
                    <div>
                      <p className="font-semibold text-[#111827]">{ing.name}</p>
                      <p className="text-[11px] text-neutral-500">
                        {ing.perOrderHighlight}
                      </p>
                    </div>
                    <span
                      className={`font-mono font-semibold tabular-nums shrink-0 ${
                        ing.stock <= 0 ? 'text-[#DC2626]' : 'text-[#047857]'
                      }`}
                    >
                      {ing.stock} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="bg-[#F5EFE6] border border-[#DCD0BE] p-4 font-mono text-[11px] text-[#047857] max-h-[440px] overflow-auto">
                {JSON.stringify(
                  {
                    tables: tables.map((t) => ({
                      id: t.id,
                      cap: t.capacity,
                      zone: t.zone,
                      accessible: t.isAccessible,
                      status: t.status,
                      course: t.currentCourse,
                    })),
                    waitingQueue: queue.filter((p) => p.status === 'WAITING'),
                    reservationsCount: reservations.length,
                  },
                  null,
                  2,
                )}
              </pre>
            )}
          </LateralSlideCard>

          {/* Right: Grounded Chat Console */}
          <LateralSlideCard
            index={1}
            className="lg:col-span-7 px-4 sm:px-6 lg:px-8 py-10 flex flex-col min-h-[580px] border-t lg:border-t-0 border-[#DCD0BE]"
          >
            <div className="flex items-center justify-between border-b border-[#DCD0BE] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <MessageSquareText className="w-5 h-5 text-[#DC2626]" />
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#111827]">
                    {isCustomer ? 'Khana-Khajana AI Concierge' : "Grounded AI Maître D'"}
                  </h2>
                  <p className="font-mono text-[11px] text-[#047857] font-semibold">
                    Zero-Hallucination Grounding Active
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="flex flex-wrap gap-2 mb-5">
              {activeChips.map((chip) => {
                const isRefusalTest = chip.toLowerCase().includes('pool');
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => sendQuery(chip)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors text-left ${
                      isRefusalTest
                        ? 'bg-red-50 border-[#DC2626]/40 text-[#B91C1C] hover:bg-[#DC2626] hover:text-white'
                        : 'bg-[#ECE3D3] border-[#DCD0BE] text-[#111827] hover:border-[#DC2626] hover:text-[#DC2626]'
                    }`}
                  >
                    {isRefusalTest ? `Hallucination Test: ${chip}` : chip}
                  </button>
                );
              })}
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 border ${
                    m.role === 'user'
                      ? 'ml-8 bg-[#ECE3D3] border-[#C9BCAA]'
                      : m.refusalTriggered
                      ? 'mr-8 bg-red-50/40 border-[#DC2626]/40'
                      : 'mr-8 bg-[#F5EFE6] border-[#DCD0BE]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 mb-1.5">
                    <span
                      className={`uppercase tracking-wider font-semibold ${
                        m.refusalTriggered
                          ? 'text-[#DC2626]'
                          : m.role === 'user'
                          ? 'text-[#111827]'
                          : 'text-[#047857]'
                      }`}
                    >
                      {m.role === 'user'
                        ? isCustomer
                          ? 'Guest'
                          : 'Admin Operator'
                        : isCustomer
                        ? 'AI Concierge'
                        : "AI Maître D'"}
                    </span>
                    <span>{m.timestamp}</span>
                  </div>

                  <p className="text-sm text-[#111827] leading-relaxed">
                    {m.content}
                  </p>

                  {m.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#DCD0BE] flex flex-wrap items-center gap-2">
                      {m.refusalTriggered ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#DC2626] font-semibold">
                          <ShieldAlert className="w-3 h-3" />
                          Guardrail Refusal Triggered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#047857] font-semibold">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Sources:
                        </span>
                      )}
                      {m.sources.map((src) => (
                        <span
                          key={src}
                          className="px-2 py-0.5 bg-[#ECE3D3] border border-[#DCD0BE] font-mono text-[10px] text-neutral-700"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isSending && (
                <div className="mr-8 p-3 bg-[#ECE3D3] border border-[#DCD0BE] font-mono text-xs text-neutral-500">
                  Verifying live floor state, kitchen inventory & restaurant_policies.md...
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuery(input);
              }}
              className="flex gap-3 pt-4 border-t border-[#DCD0BE]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about gluten-free dishes, ingredient stock, wheelchair tables, or test refusal..."
                aria-label={isCustomer ? 'Ask AI Concierge' : "Ask AI Maître D'"}
                className="flex-1 bg-transparent border-b border-[#C9BCAA] px-2 py-2.5 text-sm text-[#111827] placeholder:text-neutral-400 focus:outline-none focus:border-[#DC2626]"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="px-6 py-2.5 rounded-full bg-[#DC2626] text-white font-semibold text-sm hover:bg-[#B91C1C] disabled:opacity-50 transition-colors inline-flex items-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </LateralSlideCard>
        </div>
      </section>
    </div>
  );
}
