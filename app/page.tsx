"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, Command, Sparkles, TerminalSquare, AlertTriangle, ShieldCheck, Database, LayoutDashboard, BrainCircuit, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import SanaVisualizer from "@/components/SanaVisualizer";
import MessageBubble from "@/components/MessageBubble";
import ContextBar from "@/components/ContextBar";
import JourneyTracker from "@/components/JourneyTracker";
import { SanaResponse, ConversationState } from "@/lib/sana-engine";

import CommandNexus from "@/components/CommandNexus";
import EVMSandbox from "@/components/EVMSandbox";
import StrategySimulator from "@/components/StrategySimulator";
import GeospatialAnalytics from "@/components/GeospatialAnalytics";
import KnowledgeHub from "@/components/KnowledgeHub";
import LinguisticsConsole from "@/components/LinguisticsConsole";
import ChaosModeOverlay from "@/components/ChaosModeOverlay";

type TabId = "overview" | "command_center" | "strategy" | "evm_sandbox" | "geospatial" | "knowledge" | "linguistics";

export default function SanaExperience() {
  const { location, language, role } = useUser();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isChaosMode, setIsChaosMode] = useState(false);

  // Chat State
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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setHasMounted(true);

    const timer = setTimeout(() => {
      if (messages.length === 0 && convState.stepProgress === 0) {
        const city = location.city || "Hyderabad";
        setMessages([{
          role: "assistant",
          sanaResponse: {
            answer: `Hello! I noticed you're in ${city}. I am Sana AI, your centralized Decision Intelligence System. Let's build your strategy.`,
            nudge: "Shall we check if you're already registered in the electoral roll?",
            options: [
              { label: "Check Registration Status", info: "Verify your name in " + city, urgency: "high", intent: "verify_status" },
              { label: "I am a new voter", info: "Start registration (Form 6).", urgency: "normal", intent: "register" },
            ],
            reasoning: "Registration is the first milestone. Without it, other steps aren't possible.",
            state: { ...convState, stepProgress: 1 },
            suggestions: ["What documents do I need?", "When is the next election?"],
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
    if (activeTab === "command_center") {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = async (e?: React.FormEvent, overrideInput?: string, intent?: string) => {
    if (e) e.preventDefault();
    if (isChaosMode) {
      setScreenReaderAnnouncement("System is in offline survival mode. Requests blocked.");
      return; // Block requests during simulated outage
    }
    
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

      if (data.state) setConvState(data.state);

      setScreenReaderAnnouncement(`Sana responded: ${data.answer?.slice(0, 100)}`);
      if (isSpeaking && data.answer) speakResponse(data.answer);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        sanaResponse: {
          answer: "I couldn't fetch live data, but here's the baseline for " + (location.city || "your area") + ".",
          nudge: "Shall we try verifying your status manually?",
          options: [{ label: "Offline Checklist", info: "Essential steps to take.", urgency: "normal", intent: "basics" }],
          reasoning: "Continuity of guidance is my priority during temporary outages.",
          state: convState,
          suggestions: ["Documents checklist"],
          references: [],
          confidence: 1.0,
        },
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!hasMounted) return <div className="min-h-screen bg-[#020408]" aria-hidden="true" />;

  const startListening = () => {
    if (isChaosMode) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => handleSendMessage(undefined, event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakResponse = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const triggerChaosMode = () => {
    setIsChaosMode(true);
    setTimeout(() => {
      // Auto-recover after 10 seconds to show resilience
      setIsChaosMode(false);
      setMessages((prev) => [...prev, {
        role: "assistant",
        sanaResponse: {
          answer: "Cloud connection restored. Fallback protocols deactivated. We are back online with full RAG capabilities.",
          options: [],
          reasoning: "System resilience demonstrated. No state was lost during the outage.",
          state: convState,
          suggestions: [],
          references: [],
          confidence: 1.0,
        }
      }]);
    }, 10000);
  };

  return (
    <div className="h-screen bg-[#020408] text-white flex relative overflow-hidden font-sans">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {screenReaderAnnouncement}
      </div>

      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />

      {isChaosMode && <ChaosModeOverlay />}

      {/* Sidebar Navigation */}
      <nav className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col z-50 shrink-0 relative" aria-label="Main Navigation">
        <div className="p-8 border-b border-white/5 flex flex-col items-center justify-center">
          <div className="h-16 w-16 bg-sana/20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(163,255,0,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-sana to-transparent opacity-20" />
            <TerminalSquare className="h-8 w-8 text-sana" />
          </div>
          <h1 className="text-xl font-black tracking-widest uppercase text-white">SANA <span className="text-sana">AI</span></h1>
          <span className="text-[8px] tracking-[0.3em] uppercase text-white/30">v10.0 Firmware</span>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {[
            { id: "overview", icon: <LayoutDashboard className="h-5 w-5" />, label: "Command Nexus" },
            { id: "command_center", icon: <BrainCircuit className="h-5 w-5" />, label: "Intelligence Uplink" },
            { id: "strategy", icon: <ShieldCheck className="h-5 w-5" />, label: "Strategy Simulator" },
            { id: "evm_sandbox", icon: <Database className="h-5 w-5" />, label: "EVM Sandbox" },
            { id: "geospatial", icon: <Map className="h-5 w-5" />, label: "Geospatial Analytics" },
            { id: "knowledge", icon: <Sparkles className="h-5 w-5" />, label: "Knowledge Hub" },
            { id: "linguistics", icon: <Command className="h-5 w-5" />, label: "Linguistics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                activeTab === tab.id
                  ? "bg-sana/10 text-sana border border-sana/20 shadow-[0_0_15px_rgba(163,255,0,0.1)]"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={triggerChaosMode}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-alert/10 text-alert border border-alert/20 hover:bg-alert/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <AlertTriangle className="h-4 w-4" /> Simulate Outage
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10" id="main-content">
        <header className="shrink-0 z-40 border-b border-white/5">
          <ContextBar />
          {activeTab === "command_center" && <JourneyTracker state={convState.journey} />}
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-12 h-full">
                <CommandNexus onNavigate={setActiveTab} />
              </motion.div>
            )}

            {activeTab === "command_center" && (
              <motion.div
                key="command_center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col min-h-full"
              >
                <div className={cn(
                  "max-w-4xl mx-auto w-full flex-1 flex flex-col py-12 px-6 transition-all duration-1000",
                  messages.length <= 1 ? "justify-center" : "justify-start"
                )}>
                  {messages.length <= 1 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
                      <SanaVisualizer />
                    </motion.div>
                  )}

                  <div className="flex flex-col w-full min-h-full pb-32">
                    {messages.map((msg, i) => (
                      <MessageBubble key={i} message={msg} onAction={(val, intent) => handleSendMessage(undefined, val, intent)} />
                    ))}
                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 ml-14 mb-12">
                        <span className="h-2 w-2 rounded-full bg-sana animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-sana animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-sana animate-bounce [animation-delay:-0.3s]" />
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "strategy" && (
              <motion.div key="strategy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-12 h-full">
                <StrategySimulator />
              </motion.div>
            )}

            {activeTab === "evm_sandbox" && (
              <motion.div key="evm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-12 h-full">
                <EVMSandbox />
              </motion.div>
            )}

            {activeTab === "geospatial" && (
              <motion.div key="geospatial" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-12 h-full">
                <GeospatialAnalytics />
              </motion.div>
            )}

            {activeTab === "knowledge" && (
              <motion.div key="knowledge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-12 h-full">
                <KnowledgeHub />
              </motion.div>
            )}

            {activeTab === "linguistics" && (
              <motion.div key="linguistics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-12 h-full">
                <LinguisticsConsole />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Input Area (Only in Command Center) */}
        <AnimatePresence>
          {activeTab === "command_center" && (
            <motion.footer
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="absolute bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-[#020408] via-[#020408] to-transparent z-20 pointer-events-none"
            >
              <div className="max-w-4xl mx-auto pointer-events-auto">
                <form onSubmit={handleSendMessage} className="relative flex items-center bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 pl-8 shadow-2xl focus-within:border-sana/50 transition-all">
                  <Command className="h-6 w-6 text-white/20 mr-4" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : isChaosMode ? "Offline Mode Active..." : "Ask Sana anything..."}
                    disabled={isChaosMode}
                    className="flex-1 bg-transparent border-none outline-none py-5 text-xl placeholder:text-white/10 font-medium disabled:opacity-50"
                  />
                  <div className="flex items-center gap-2 pr-4">
                    <button type="button" onClick={startListening} disabled={isChaosMode} className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all", isListening ? "bg-alert text-white animate-pulse" : "text-white/20 hover:text-white")}>
                      <Mic className="h-6 w-6" />
                    </button>
                    <button type="submit" disabled={!chatInput.trim() || isChaosMode} className="h-12 w-12 bg-sana rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                      <Send className="h-6 w-6" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
