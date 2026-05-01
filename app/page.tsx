"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Mic,
  Command,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import SanaVisualizer from "@/components/SanaVisualizer";
import MessageBubble from "@/components/MessageBubble";
import ContextBar from "@/components/ContextBar";
import JourneyTracker from "@/components/JourneyTracker";
import { SanaResponse, ConversationState } from "@/lib/sana-engine";

/**
 * SanaExperience — the primary chat interface for Sana AI.
 *
 * This component manages the full conversation lifecycle including:
 * - Proactive initial greeting based on detected location
 * - Voice input via Web Speech API
 * - Text-to-speech for AI responses
 * - Journey state tracking across conversation turns
 * - ARIA live regions for screen reader announcements
 */
export default function SanaExperience() {
  const { location, language, role } = useUser();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content?: string; sanaResponse?: SanaResponse }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState("");
  const [convState, setConvState] = useState<ConversationState>({
    stepProgress: 0,
    journey: { isRegistered: false, isVerified: false, hasBoothInfo: false, readyToVote: false },
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Smoothly scrolls to the bottom of the chat history. */
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Proactive initial greeting based on detected location
  useEffect(() => {
    setHasMounted(true);

    const timer = setTimeout(() => {
      if (messages.length === 0 && convState.stepProgress === 0) {
        const city = location.city || "Hyderabad";
        setMessages([{
          role: "assistant",
          sanaResponse: {
            answer: `Hello! I noticed you're in ${city}. Elections are a key opportunity to shape ${city}'s future, and I'm here to ensure you're fully prepared.`,
            nudge: "Since you're just starting, shall we check if you're already registered in the electoral roll?",
            options: [
              { label: "Check Registration Status", info: "Verify your name in " + city, urgency: "high", intent: "verify_status" },
              { label: "I am a new voter", info: "Start registration (Form 6).", urgency: "normal", intent: "register" },
            ],
            reasoning: "Registration is the first milestone. Without it, other steps like finding a booth aren't possible.",
            state: { ...convState, stepProgress: 1 },
            suggestions: [
              "What documents do I need?",
              "When is the next election?",
            ],
            references: [],
            confidence: 1.0,
          },
        }]);
        setConvState((prev) => ({ ...prev, stepProgress: 1 }));
        setScreenReaderAnnouncement("Sana AI is ready. An initial greeting has been displayed.");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.city]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  /**
   * Handles sending a message to the Sana AI backend.
   *
   * @param e - Optional form submit event.
   * @param overrideInput - Optional pre-filled message (e.g., from voice input).
   * @param intent - Optional machine intent for stateful routing.
   */
  const handleSendMessage = async (e?: React.FormEvent, overrideInput?: string, intent?: string) => {
    if (e) e.preventDefault();
    const message = overrideInput || chatInput;
    if (!message.trim() && !intent) return;

    const displayMessage = overrideInput || chatInput || (intent ? `Action: ${intent.replace("_", " ")}` : "");

    const userMessage = { role: "user", content: displayMessage };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);
    setScreenReaderAnnouncement("Processing your request. Please wait.");

    const history = messages.slice(-5).map((m) => ({
      role: m.role,
      content: m.content || m.sanaResponse?.answer,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: intent ? `INTENT: ${intent}` : message,
          context: { location, role, language },
          history,
          state: convState,
        }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", sanaResponse: data }]);

      if (data.state) {
        setConvState(data.state);
      }

      setScreenReaderAnnouncement(`Sana responded: ${data.answer?.slice(0, 100)}`);

      if (isSpeaking && data.answer) {
        speakResponse(data.answer);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [...prev, {
        role: "assistant",
        sanaResponse: {
          answer: "I couldn't fetch live data, but here's the baseline for " + (location.city || "your area") + ".",
          nudge: "Shall we try verifying your status manually?",
          options: [
            { label: "Offline Checklist", info: "Essential steps to take.", urgency: "normal", intent: "basics" },
          ],
          reasoning: "Continuity of guidance is my priority during temporary outages.",
          state: convState,
          suggestions: ["Documents checklist"],
          references: [],
          confidence: 1.0,
        },
      }]);
      setScreenReaderAnnouncement("An error occurred. Showing offline guidance.");
    } finally {
      setIsTyping(false);
    }
  };

  if (!hasMounted) return <div className="min-h-screen bg-[#020408]" aria-hidden="true" />;

  /**
   * Initiates voice input using the Web Speech API.
   * Falls back silently if the browser doesn't support it.
   */
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setScreenReaderAnnouncement("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => {
      setIsListening(true);
      setScreenReaderAnnouncement("Listening for voice input.");
    };
    recognition.onresult = (event: any) => handleSendMessage(undefined, event.results[0][0].transcript);
    recognition.onend = () => {
      setIsListening(false);
      setScreenReaderAnnouncement("Voice input ended.");
    };
    recognition.onerror = () => {
      setIsListening(false);
      setScreenReaderAnnouncement("Voice input failed. Please try again.");
    };
    recognition.start();
  };

  /**
   * Speaks the AI response aloud using the Web Speech Synthesis API.
   * @param text - The response text to speak.
   */
  const speakResponse = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-screen bg-[#020408] text-white flex flex-col relative overflow-hidden">
      {/* Screen Reader Announcements (ARIA Live Region) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {screenReaderAnnouncement}
      </div>

      {/* Background FX — decorative, hidden from assistive tech */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />

      {/* Header: Context Bar & Journey Tracker */}
      <header className="shrink-0 z-50" role="banner">
        <ContextBar />
        <nav aria-label="Voter journey progress">
          <JourneyTracker state={convState.journey} />
        </nav>
      </header>

      {/* Main Chat Container */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto px-6 custom-scrollbar relative z-10 flex flex-col scroll-smooth"
        role="main"
        aria-label="Sana AI Chat"
      >
        <div className={cn(
          "max-w-4xl mx-auto w-full flex-1 flex flex-col py-12 transition-all duration-1000",
          messages.length <= 1 ? "justify-center" : "justify-start"
        )}>
          {/* Centered Intro Visual (only if very few messages) */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
              aria-hidden="true"
            >
              <SanaVisualizer />
            </motion.div>
          )}

          {/* Message History */}
          <div className="flex flex-col w-full min-h-full" role="log" aria-label="Conversation history">
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                onAction={(val, intent) => handleSendMessage(undefined, val, intent)}
              />
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 ml-14 mb-12"
                role="status"
                aria-label="Sana is typing"
              >
                <span className="h-2 w-2 rounded-full bg-sana animate-bounce" aria-hidden="true" />
                <span className="h-2 w-2 rounded-full bg-sana animate-bounce [animation-delay:-0.15s]" aria-hidden="true" />
                <span className="h-2 w-2 rounded-full bg-sana animate-bounce [animation-delay:-0.3s]" aria-hidden="true" />
              </motion.div>
            )}
            <div ref={chatEndRef} className="h-32 shrink-0" />
          </div>
        </div>
      </main>

      {/* Fixed Bottom Input Area */}
      <footer className="shrink-0 p-8 pt-4 relative z-20 bg-gradient-to-t from-[#020408] via-[#020408] to-transparent border-t border-white/5" role="contentinfo">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="relative flex items-center bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 pl-8 focus-within:border-sana/50 transition-all shadow-2xl"
            role="search"
            aria-label="Chat with Sana AI"
          >
            <Command className="h-6 w-6 text-white/20 mr-4" aria-hidden="true" />
            <label htmlFor="sana-chat-input" className="sr-only">
              Ask Sana anything about voter registration, elections, or civic procedures
            </label>
            <input
              id="sana-chat-input"
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask Sana anything..."}
              className="flex-1 bg-transparent border-none outline-none py-5 text-xl placeholder:text-white/10 font-medium"
              autoComplete="off"
              aria-describedby="chat-input-hint"
            />
            <span id="chat-input-hint" className="sr-only">
              Type your question and press Enter or click the send button.
            </span>

            <div className="flex items-center gap-2 pr-4">
              <button
                type="button"
                onClick={startListening}
                aria-label={isListening ? "Voice input active — listening" : "Activate voice input"}
                aria-pressed={isListening}
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center transition-all focus:ring-2 focus:ring-sana focus:outline-none",
                  isListening ? "bg-alert text-white animate-pulse" : "text-white/20 hover:text-white"
                )}
              >
                <Mic className="h-6 w-6" aria-hidden="true" />
              </button>

              <button
                type="submit"
                disabled={!chatInput.trim()}
                aria-label="Send message to Sana AI"
                className="h-12 w-12 bg-sana rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 focus:ring-2 focus:ring-white focus:outline-none"
              >
                <Send className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-center gap-6 opacity-30" aria-hidden="true">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-sana" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Proactive Decision Intelligence Active</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Milestone: {Object.values(convState.journey).filter(Boolean).length}/4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
