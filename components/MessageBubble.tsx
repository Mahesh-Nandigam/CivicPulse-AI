"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Bot,
  User,
  Lightbulb,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { SanaResponse, StrategicOption, Reference } from "@/lib/sana-engine";

/**
 * Props for the MessageBubble component.
 */
interface MessageBubbleProps {
  /** The message object containing role and content. */
  message: {
    role: "user" | "assistant";
    content?: string;
    sanaResponse?: SanaResponse;
  };
  /** Callback when the user selects a strategic option or suggestion. */
  onAction?: (value: string, intent?: string) => void;
}

/**
 * MessageBubble renders a single conversation message.
 *
 * For user messages, it displays a simple text bubble.
 * For Sana responses, it renders a rich card with:
 * - Strategic answer text
 * - Proactive nudge banner
 * - Recommended next steps with urgency indicators
 * - Strategic reasoning (trust layer)
 * - Reference links to official sources
 * - Dynamic follow-up suggestions
 *
 * @param props - Message data and action callback.
 * @returns A fully accessible, animated message bubble.
 */
export default function MessageBubble({ message, onAction }: MessageBubbleProps) {
  const isSana = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-12 gap-6 group",
        !isSana && "flex-row-reverse"
      )}
      role="article"
      aria-label={isSana ? "Sana AI response" : "Your message"}
    >
      {/* Avatar */}
      <div
        className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center shrink-0 border transition-all duration-500",
          isSana
            ? "bg-sana/10 border-sana/30 text-sana shadow-[0_0_15px_rgba(163,255,0,0.2)] group-hover:shadow-[0_0_25px_rgba(163,255,0,0.4)]"
            : "bg-white/5 border-white/10 text-white/40"
        )}
        aria-hidden="true"
      >
        {isSana ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
      </div>

      {/* Content Container */}
      <div className={cn("flex flex-col max-w-[85%]", !isSana && "items-end")}>
        {/* User Message */}
        {!isSana && (
          <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] rounded-tr-none text-xl text-white/90 font-medium shadow-xl">
            {message.content}
          </div>
        )}

        {/* Sana Response */}
        {isSana && message.sanaResponse && (
          <div className="space-y-8">
            {/* Answer Text */}
            <div className="text-2xl md:text-3xl text-white font-medium leading-relaxed tracking-tight">
              {message.sanaResponse.answer}
            </div>

            {/* Strategic Options List */}
            {message.sanaResponse.options && message.sanaResponse.options.length > 0 && (
              <div className="space-y-4" role="group" aria-label="Recommended next steps">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">
                  Recommended Next Steps
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {message.sanaResponse.options.map((opt: StrategicOption, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onAction?.(opt.label, opt.intent)}
                      aria-label={`Select option: ${opt.label}. ${opt.info}`}
                      className={cn(
                        "group/opt p-6 rounded-3xl border transition-all duration-300 text-left focus:ring-2 focus:ring-sana focus:outline-none",
                        opt.urgency === "high"
                          ? "bg-sana/5 border-sana/20 hover:bg-sana/10"
                          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "text-xl font-bold",
                          opt.urgency === "high" ? "text-sana" : "text-white/80"
                        )}>
                          {opt.label}
                        </span>
                        {opt.urgency === "high" && (
                          <span className="text-[8px] font-black bg-sana/20 text-sana px-2 py-0.5 rounded uppercase tracking-widest" role="status">
                            Priority
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-white/50 leading-relaxed">{opt.info}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trust & Reasoning Layer */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-4">
              {message.sanaResponse.nudge && (
                <div className="mb-6 p-6 rounded-2xl bg-sana/10 border border-sana/20 animate-in fade-in slide-in-from-bottom-4 duration-1000" role="alert">
                  <div className="flex items-center gap-3 mb-2">
                    <Bot className="h-4 w-4 text-sana" aria-hidden="true" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-sana">Proactive Nudge</span>
                  </div>
                  <p className="text-xl font-bold text-white italic">
                    &ldquo;{message.sanaResponse.nudge}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="h-1 w-8 bg-sana/30 rounded-full" aria-hidden="true" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Strategic Reasoning</h4>
              </div>
              <p className="text-xl text-white/70 leading-relaxed italic">
                &ldquo;{message.sanaResponse.reasoning}&rdquo;
              </p>
            </div>

            {/* References */}
            {message.sanaResponse.references && message.sanaResponse.references.length > 0 && (
              <nav className="flex flex-wrap gap-3 pt-4 border-t border-white/5" aria-label="Official sources and links">
                {message.sanaResponse.references.map((ref: Reference, idx: number) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white/30 hover:text-sana hover:border-sana/40 transition-all focus:ring-2 focus:ring-sana focus:outline-none"
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    {ref.name}
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                ))}
              </nav>
            )}

            {/* Dynamic Suggestions */}
            {message.sanaResponse.suggestions && (
              <div className="flex flex-wrap gap-3 pt-6" role="group" aria-label="Follow-up suggestions">
                {message.sanaResponse.suggestions.map((suggestion: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => onAction?.(suggestion)}
                    aria-label={`Ask about: ${suggestion}`}
                    className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-sana/10 border border-sana/20 text-sana font-black uppercase text-xs tracking-widest hover:bg-sana/20 transition-all group/btn shadow-lg focus:ring-2 focus:ring-sana focus:outline-none"
                  >
                    {suggestion}
                    <ArrowRight className="h-4 w-4 opacity-40 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
