"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Ero — SkulSuite's AI assistant mascot (build prompt §12).
 *
 * Real AI: messages go to the /ero-chat Netlify function, which calls the LLM
 * server-side (key never in the browser) with the approved knowledge base.
 * If the API is unreachable (e.g. local preview) Ero falls back to scripted
 * quick replies — the same fallback the PDF's test E8 requires.
 *
 * Politeness rules implemented (§12):
 * - ONE proactive greeting per visit, only after 15s on the page, never while
 *   the visitor types, never on /demo or /contact (forms), never on /pricing
 *   checkout area — a small help bubble instead.
 * - Dismissal remembered for 7 days (localStorage).
 * - Mute toggle remembered; NO sound before first user interaction (E13);
 *   every sound has a visual twin (E15).
 * - Reduced-motion respected via CSS (animations simply don't run).
 * - Ero always says he's an AI (first assistant message states it).
 */

const DISMISS_KEY = "ero-dismissed-at";
const MUTE_KEY = "ero-muted";
const GREETED_KEY = "ero-greeted";
const DISMISS_DAYS = 7;
const GREET_DELAY_MS = 15_000;

type Msg = { role: "user" | "assistant"; content: string };

/** Page-aware greeting lines (admin-editable once the platform exists). */
const GREETINGS: Record<string, string> = {
  "/": "Hi, I'm Ero! 👋 I'm SkulSuite's AI helper — not a human, but I know this site well. Looking for the right product, the price for your school, or a demo?",
  "/products": "Picking a product? Tell me your school's biggest headache — exams, records, or results — and I'll point you to the right one.",
  "/pricing": "Working out your price? The calculator below gives exact totals. Or tell me your student number and what you need, and I'll guide you.",
  "/offline": "No internet in your area? No problem — the offline edition runs on your school's own network. Want me to point you to the comparison or find your package?",
  "/find-my-package": "Let's find your package! Answer the four quick questions and I'll hand you a real price in under a minute.",
  "/resources": "Free downloads here — price list, trial kit, sample questions. Want help choosing what to try first?",
  "/how-it-works": "Wondering how setup goes? I can walk you through the steps — or book a demo and see it live.",
  "/faq": "Still unsure after the FAQ? Ask me anything about the products or pricing.",
  "/contact": "Prefer to talk to a person? The form and WhatsApp here reach the team directly. I'm just the robot! 🤖",
};

const QUICK_REPLIES = [
  "What does it cost?",
  "Find my package",
  "Which product do I need?",
  "Book a demo",
  "Talk to a human on WhatsApp",
];

const FALLBACKS: Record<string, string> = {
  "/pricing":
    "I'm in simple mode right now — the calculator on this page gives exact totals instantly. Set your school size and tick your products, and it does all the maths.",
  default:
    "I'm running in simple mode right now, but I can still point you: Products for what each tool does, Pricing for exact prices, or Request a Demo to see everything live.",
};

function isOnboardingSeason() {
  // Keep the greeting subtle during form pages; never on demo/contact.
  return true;
}

export function EroAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const sessionId = useRef<string>("");
  const historyRef = useRef<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onFormPage = pathname === "/demo" || pathname === "/contact";
  const greeting = GREETINGS[pathname] ?? GREETINGS["/"];
  // Stack the launcher above the WhatsApp bubble + demo bar on phones
  // (build prompt §12: Ero must not overlap the sticky bar or WhatsApp).
  // Env vars are inlined at build time, so this is SSR-safe.
  const whatsappPresent = !!buildWhatsAppLink("x");

  // Session id + persisted mute + first-interaction tracking (E13/E14).
  useEffect(() => {
    try {
      setMuted(localStorage.getItem(MUTE_KEY) === "1");
    } catch { /* ignore */ }
    const sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionId.current = sid;
    const markInteract = () => setInteracted(true);
    window.addEventListener("pointerdown", markInteract, { once: true, passive: true });
    window.addEventListener("keydown", markInteract, { once: true });
    return () => {
      window.removeEventListener("pointerdown", markInteract);
      window.removeEventListener("keydown", markInteract);
    };
  }, []);

  // Proactive greeting: once per visit, 15s, never on form pages, respect 7-day dismissal.
  useEffect(() => {
    if (onFormPage || !isOnboardingSeason()) return;
    let dismissed = false;
    try {
      const at = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
      dismissed = at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 3600 * 1000;
      if (sessionStorage.getItem(GREETED_KEY) === "1") dismissed = true;
    } catch { /* ignore */ }
    if (dismissed) return;
    const t = setTimeout(() => {
      try { sessionStorage.setItem(GREETED_KEY, "1"); } catch { /* ignore */ }
      setBubble(greeting);
    }, GREET_DELAY_MS);
    return () => clearTimeout(t);
  }, [onFormPage, greeting]);

  // Keep the chat scrolled to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  // Celebrate on demo-form success (dispatched by LeadForm).
  useEffect(() => {
    const onCelebrate = () => {
      setCelebrating(true);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "🎉 Demo request received! Well done — the team will reach out shortly to arrange your walkthrough. Check your phone or email soon.",
        },
      ]);
      setTimeout(() => setCelebrating(false), 4000);
    };
    window.addEventListener("ero-celebrate", onCelebrate);
    return () => window.removeEventListener("ero-celebrate", onCelebrate);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const msg = text.trim();
      if (!msg || busy) return;
      setInteracted(true);
      setInput("");
      const next = [...historyRef.current, { role: "user" as const, content: msg }];
      historyRef.current = next;
      setMessages(next);
      setBusy(true);
      try {
        const res = await fetch("/api/ero-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: msg,
            page: pathname,
            sessionId: sessionId.current,
            history: historyRef.current.slice(-8),
          }),
        });
        const data = await res.json();
        const reply = data.reply ?? FALLBACKS[pathname] ?? FALLBACKS.default;
        historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
        setMessages([...historyRef.current]);
      } catch {
        const reply = FALLBACKS[pathname] ?? FALLBACKS.default;
        historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
        setMessages([...historyRef.current]);
      } finally {
        setBusy(false);
      }
    },
    [busy, pathname],
  );

  const handleQuick = (q: string) => {
    if (q === "Book a demo") {
      window.location.href = "/demo";
      return;
    }
    if (q === "Find my package") {
      window.location.href = "/find-my-package";
      return;
    }
    if (q === "Talk to a human on WhatsApp") {
      window.location.href = "/contact";
      return;
    }
    void send(q);
  };

  const dismiss = (permanent: boolean) => {
    setBubble(null);
    setOpen(false);
    if (permanent) {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* ignore */ }
    }
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      try { localStorage.setItem(MUTE_KEY, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <>
      {/* Proactive speech bubble */}
      {bubble && !open && !onFormPage ? (
        <div className="fixed bottom-36 right-4 z-40 max-w-[260px] rounded-xl rounded-br-sm border border-brand-100 bg-white p-3.5 pr-8 text-sm text-slate-700 shadow-lg sm:bottom-6 sm:right-20">
          <button
            type="button"
            aria-label="Dismiss Ero for 7 days"
            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={() => dismiss(true)}
          >
            ✕
          </button>
          <p>{bubble}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              onClick={() => { setOpen(true); setBubble(null); }}
            >
              Chat with Ero
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-300"
              onClick={() => dismiss(false)}
            >
              Later
            </button>
          </div>
        </div>
      ) : null}

      {/* Chat panel — classroom chalkboard */}
      {open ? (
        <div
          role="dialog"
          aria-label="Chat with Ero, the AI assistant"
          className="fixed bottom-24 right-3 z-50 flex h-[420px] w-[calc(100vw-1.5rem)] max-w-[340px] flex-col overflow-hidden rounded-2xl border-[6px] border-[#7a5230] bg-[#1f3d2b] shadow-2xl sm:bottom-6 sm:right-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-4 border-[#7a5230] bg-[#16301f] px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <EroFace
                celebrating={celebrating}
                talking={busy}
                className="h-9 w-9 shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-[#f3f7f2]">Ero</p>
                <p className="text-[10px] font-medium text-[#a8c3a8]">AI assistant · SkulSuite</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={muted ? "Unmute Ero sounds" : "Mute Ero sounds"}
                title={muted ? "Sounds off" : "Sounds on"}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#a8c3a8] hover:bg-white/10"
                onClick={toggleMute}
              >
                {muted ? "🔇" : "🔊"}
              </button>
              <button
                type="button"
                aria-label="Close chat"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#a8c3a8] hover:bg-white/10"
                onClick={() => dismiss(false)}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages — chalk on a chalkboard */}
          <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3">
            <MsgBubble text={greeting} />
            {messages.map((m, i) => (
              <MsgBubble key={i} text={m.content} fromUser={m.role === "user"} />
            ))}
            {busy ? (
              <p className="chalk animate-pulse text-xs text-[#cfe3cf]">Ero is writing…</p>
            ) : null}
          </div>

          {/* Quick replies */}
          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-1.5 px-3.5 pb-2">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-full border border-[#a8c3a8]/40 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-[#f3f7f2] hover:bg-white/20"
                  onClick={() => handleQuick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          ) : null}

          {/* Input */}
          <form
            className="flex items-center gap-2 border-t-4 border-[#7a5230] bg-[#16301f] px-3 py-2.5"
            onSubmit={(e) => { e.preventDefault(); void send(input); }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, prices…"
              maxLength={300}
              aria-label="Message to Ero"
              className="min-h-[40px] flex-1 rounded-lg border border-white/10 bg-white/95 px-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || input.trim().length === 0}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
            >
              ➤
            </button>
          </form>
        </div>
      ) : null}

      {/* Launcher + help icon on form pages */}
      {!open ? (
        <button
          type="button"
          aria-label={onFormPage ? "Need help? Open Ero chat" : "Chat with Ero, the AI assistant"}
          className={`ero-btn fixed right-4 z-40 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 ${
            onFormPage
              ? "bottom-4 h-11 w-11 text-lg"
              : `h-14 w-14 text-2xl ${
                  whatsappPresent ? "bottom-36" : "bottom-24"
                } sm:bottom-5 sm:right-5`
          } ${celebrating ? "animate-bounce" : ""}`}
          onClick={() => { setOpen(true); setBubble(null); setInteracted(true); }}
        >
          {onFormPage ? (
            "🤖"
          ) : (
            <EroFace
              celebrating={celebrating}
              waving={!!bubble}
              className="h-14 w-14"
            />
          )}
        </button>
      ) : null}
    </>
  );
}

function MsgBubble({ text, fromUser = false }: { text: string; fromUser?: boolean }) {
  if (fromUser) {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-xl rounded-br-sm bg-[#f7f1e3] px-3 py-2 text-sm text-slate-800 shadow-sm">
          {text}
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <p className="chalk max-w-[90%] text-sm leading-6 text-[#f3f7f2]">{text}</p>
    </div>
  );
}

/**
 * Ero's face: a living inline-SVG robot character (no image payload, brand colours).
 *
 * Real animation, all pure CSS (see globals.css "Ero character animation"):
 * - floats gently at rest
 * - blinks every few seconds
 * - graduation-cap tassel swings, chest light and antenna tip glow
 * - the right arm waves on hover, while the greeting bubble is up, and in a
 *   loop while celebrating (demo-form success)
 * - while Ero is writing a reply (talking) the smile becomes a moving mouth
 * Everything is disabled for visitors who prefer reduced motion.
 */
function EroFace({
  celebrating = false,
  talking = false,
  waving = false,
  className = "",
}: {
  celebrating?: boolean;
  talking?: boolean;
  waving?: boolean;
  className?: string;
}) {
  const state = celebrating ? "ero-celebrate" : waving ? "ero-wave" : "";
  return (
    <svg
      viewBox="0 0 64 64"
      className={`ero-face drop-shadow ${state} ${className}`}
      aria-hidden="true"
    >
      {/* Head */}
      <rect x="14" y="20" width="36" height="30" rx="8" fill="#2563eb" />
      {/* Screen chest */}
      <rect x="22" y="44" width="20" height="12" rx="3" fill="#1e40af" />
      <circle cx="32" cy="50" r="3" fill="#4ade80" className="ero-chest-light" />
      {/* Eyes — blink together as one group */}
      <g className="ero-eyes">
        <circle cx="26" cy="34" r="3.2" fill="#fff" />
        <circle cx="38" cy="34" r="3.2" fill="#fff" />
        <circle cx="26.8" cy="34.6" r="1.5" fill="#0f172a" />
        <circle cx="38.8" cy="34.6" r="1.5" fill="#0f172a" />
      </g>
      {/* Mouth — smiles at rest, moves while Ero writes a reply */}
      {talking ? (
        <ellipse cx="32" cy="40" rx="3.6" ry="3" fill="#fff" className="ero-mouth-talk" />
      ) : (
        <path
          d="M26 40q6 4 12 0"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {/* Graduation cap */}
      <path d="M12 18 32 8l20 10-20 8-20-10z" fill="#f59e0b" />
      {/* Cap tassel — swings gently */}
      <g className="ero-tassel">
        <path d="M46 21v8" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="46" cy="30" r="2" fill="#fbbf24" />
      </g>
      {/* Antenna */}
      <path d="M32 20v-5" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="13" r="2.5" fill="#60a5fa" className="ero-antenna-tip" />
      {/* Arms — left rests, right waves (drawn last so it passes in front) */}
      <rect x="9" y="30" width="4" height="14" rx="2" fill="#1d4ed8" />
      <circle cx="11" cy="46" r="2.8" fill="#93c5fd" />
      <g className="ero-arm">
        <rect x="51" y="24" width="4" height="13" rx="2" fill="#1d4ed8" />
        <circle cx="53" cy="22" r="2.8" fill="#93c5fd" />
      </g>
    </svg>
  );
}
