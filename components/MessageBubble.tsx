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
      <div className={cn("max-w-3xl w-full flex gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        <div className="shrink-0 pt-2">
          {isUser ? (
            <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-white/50 shadow-inner">
              <User className="h-5 w-5" />
            </div>
          ) : (
            <div className="h-12 w-12 bg-black rounded-2xl flex items-center justify-center text-sana shadow-[0_0_20px_rgba(163,255,0,0.15)] relative overflow-hidden border border-sana/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-sana to-transparent opacity-20" />
              <Sparkles className="h-6 w-6 relative z-10" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={cn("flex flex-col gap-3 min-w-0 flex-1", isUser ? "items-end" : "items-start")}>
          {isUser ? (
            <div className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-[2rem] rounded-tr-none text-lg max-w-[85%] shadow-xl">
              {message.content}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              
              {/* Perplexity-style Thinking Steps */}
              {message.sanaResponse?.thinkingSteps && message.sanaResponse.thinkingSteps.length > 0 && (
                <div className="w-full max-w-2xl bg-black/40 border border-white/5 rounded-2xl overflow-hidden mb-2">
                  <button 
                    onClick={() => setShowThinking(!showThinking)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors text-white/50 text-sm font-bold tracking-wide"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-sana" />
                      Intelligence Uplink Process
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showThinking ? "rotate-180" : "")} />
                  </button>
                  <AnimatePresence>
                    {showThinking && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-4 space-y-3"
                      >
                        {message.sanaResponse.thinkingSteps.map((step, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.4 }}
                            className="flex items-center gap-3 text-sm text-white/60"
                          >
                            <CheckCircle2 className="h-4 w-4 text-sana/50 shrink-0" />
                            <span>{step}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Perplexity-style Sources */}
              {message.sanaResponse?.references && message.sanaResponse.references.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="w-full text-xs font-black uppercase tracking-widest text-white/30 mb-1 flex items-center gap-2">
                    <BookOpen className="h-3 w-3" /> Grounded Sources
                  </div>
                  {message.sanaResponse.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 transition-all hover:text-sana group"
                    >
                      <span className="text-white/30 font-mono group-hover:text-sana/50">{idx + 1}</span>
                      {ref.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Main Answer */}
              {message.sanaResponse?.answer && (
                <div className="text-white/90 text-lg leading-relaxed prose prose-invert max-w-none">
                  {message.sanaResponse.answer.split('\n').map((line, i) => (
                    <p key={i} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, (match, p1) => `<strong class="text-white font-bold">${p1}</strong>`) }}>
                    </p>
                  ))}
                </div>
              )}

              {/* Tactical Options Grid */}
              {message.sanaResponse?.options && message.sanaResponse.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4" role="group">
                  {message.sanaResponse.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onAction && onAction(opt.label, opt.intent || "option_selected")}
                      className={cn(
                        "group relative flex flex-col items-start text-left p-5 rounded-2xl border transition-all duration-300 overflow-hidden",
                        opt.urgency === "high"
                          ? "bg-sana/10 border-sana/30 hover:bg-sana hover:border-sana hover:text-black hover:shadow-[0_0_20px_rgba(163,255,0,0.4)]"
                          : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                      )}
                    >
                      <div className="flex justify-between w-full items-center mb-2">
                        <span className={cn(
                          "font-bold tracking-wide transition-colors",
                          opt.urgency === "high" ? "text-sana group-hover:text-black" : "text-white"
                        )}>
                          {opt.label}
                        </span>
                        <ArrowRight className={cn(
                          "h-5 w-5 transition-transform group-hover:translate-x-1",
                          opt.urgency === "high" ? "text-sana group-hover:text-black" : "text-white/50"
                        )} />
                      </div>
                      <span className={cn(
                        "text-sm transition-colors",
                        opt.urgency === "high" ? "text-sana/70 group-hover:text-black/70" : "text-white/50"
                      )}>
                        {opt.info}
                      </span>
                    </button>
                  ))}
                </div>
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
