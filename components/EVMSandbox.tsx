"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, MapPin, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

const CANDIDATES = [
  { id: 1, name: "Rajesh Kumar", party: "Democracy First Party", symbol: "🌟" },
  { id: 2, name: "Priya Sharma", party: "Progressive Alliance", symbol: "🕊️" },
  { id: 3, name: "Amit Singh", party: "National Unity Front", symbol: "🦁" },
  { id: 4, name: "NOTA", party: "None of the Above", symbol: "❌" },
];

export default function EVMSandbox() {
  const [activeTab, setActiveTab] = useState<"booth" | "evm">("evm");
  const [pincode, setPincode] = useState("");
  const [boothFound, setBoothFound] = useState(false);

  // EVM State
  const [evmState, setEvmState] = useState<"idle" | "voting" | "vvpat" | "done">("idle");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [vvpatTimer, setVvpatTimer] = useState(7);

  const handleVote = (id: number) => {
    if (evmState !== "idle") return;
    setEvmState("voting");
    setSelectedCandidate(id);

    // Simulate beep and light
    setTimeout(() => {
      setEvmState("vvpat");
      setVvpatTimer(7);
    }, 1000);
  };

  useEffect(() => {
    if (evmState === "vvpat") {
      const interval = setInterval(() => {
        setVvpatTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setEvmState("done");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [evmState]);

  const resetEVM = () => {
    setEvmState("idle");
    setSelectedCandidate(null);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("evm")}
          className={cn(
            "px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all",
            activeTab === "evm" ? "bg-sana text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
        >
          EVM Simulator
        </button>
        <button
          onClick={() => setActiveTab("booth")}
          className={cn(
            "px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all",
            activeTab === "booth" ? "bg-sana text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
        >
          Booth Intelligence
        </button>
      </div>

      {activeTab === "evm" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Ballot Unit */}
          <div className="bg-[#e6e6e6] rounded-[2rem] p-8 shadow-2xl flex flex-col border-4 border-[#cccccc]">
            <div className="flex justify-between items-center mb-6 bg-blue-600 text-white px-6 py-2 rounded-t-xl">
              <span className="font-bold tracking-widest">BALLOT UNIT</span>
              <span className="text-xs font-mono">READY</span>
            </div>

            <div className="flex-1 space-y-4">
              {CANDIDATES.map((c) => (
                <div key={c.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-gray-300">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-500 border border-gray-300">
                    {c.id}
                  </div>
                  <div className="flex-1 flex items-center justify-between px-4 text-black">
                    <div>
                      <div className="font-bold text-lg leading-none">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.party}</div>
                    </div>
                    <div className="text-3xl">{c.symbol}</div>
                  </div>
                  <div className="flex items-center gap-4 pl-4 border-l-2 border-gray-200">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 border-gray-400",
                      selectedCandidate === c.id && evmState !== "idle" ? "bg-red-500 shadow-[0_0_15px_red]" : "bg-gray-300"
                    )} />
                    <button
                      onClick={() => handleVote(c.id)}
                      disabled={evmState !== "idle"}
                      className="w-12 h-8 bg-blue-500 rounded-full shadow-[0_4px_0_#1d4ed8] active:shadow-[0_0px_0_#1d4ed8] active:translate-y-1 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VVPAT & Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-sm text-white/50 font-bold tracking-widest mb-4">VVPAT VERIFICATION</div>
              
              <div className="w-64 h-80 bg-black border-8 border-gray-800 rounded-xl relative flex flex-col items-center justify-center p-4">
                <div className="w-full h-full bg-white/5 rounded flex items-center justify-center overflow-hidden border border-white/10 relative shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
                  <AnimatePresence>
                    {evmState === "vvpat" && selectedCandidate && (
                      <motion.div
                        initial={{ y: -200 }}
                        animate={{ y: 0 }}
                        exit={{ y: 200, opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="bg-white w-48 py-8 px-4 flex flex-col items-center text-black border-2 border-gray-300 shadow-xl"
                      >
                        <div className="text-4xl mb-2">{CANDIDATES.find(c => c.id === selectedCandidate)?.symbol}</div>
                        <div className="font-bold text-xl text-center">{CANDIDATES.find(c => c.id === selectedCandidate)?.name}</div>
                        <div className="text-xs text-gray-500 mt-4 border-t border-dashed w-full text-center pt-2">
                          VVPAT SLIP - {vvpatTimer}s
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {evmState === "vvpat" && (
                  <div className="absolute top-2 right-2 text-sana font-mono text-xl animate-pulse">
                    {vvpatTimer}
                  </div>
                )}
              </div>

              {evmState === "done" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 flex flex-col items-center"
                >
                  <div className="flex items-center gap-2 text-sana font-bold mb-4">
                    <CheckCircle2 className="h-5 w-5" />
                    Vote Cast Successfully
                  </div>
                  <button
                    onClick={resetEVM}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold tracking-widest transition-all"
                  >
                    Reset Simulator
                  </button>
                </motion.div>
              )}
            </div>

            <div className="bg-sana/10 border border-sana/20 rounded-2xl p-6">
              <h3 className="flex items-center gap-2 text-sana font-bold mb-2">
                <ShieldCheck className="h-5 w-5" />
                VVPAT Integrity
              </h3>
              <p className="text-sm text-white/70">
                The Voter Verifiable Paper Audit Trail (VVPAT) allows voters to verify that their vote was cast correctly. The slip remains visible for 7 seconds before dropping into a sealed box.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "booth" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <div className="max-w-2xl w-full mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Booth Intelligence</h2>
              <p className="text-white/50">Locate your polling station and review security protocols.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex">
              <input
                type="text"
                placeholder="Enter Pincode or Locality (e.g. 400012)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 bg-transparent px-4 focus:outline-none text-white placeholder:text-white/30"
              />
              <button
                onClick={() => setBoothFound(true)}
                className="bg-sana text-black px-6 py-3 rounded-xl font-bold tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Search className="h-4 w-4" />
                SCAN
              </button>
            </div>

            {boothFound && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 flex gap-6">
                  <div className="h-16 w-16 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-1">Polling Station 42-A</h3>
                    <p className="text-white/70 mb-4">Govt Primary School, Room 3, Station Road.</p>
                    <div className="flex gap-4 text-sm">
                      <span className="bg-white/10 px-3 py-1 rounded-md text-white/50">Timing: 7 AM - 6 PM</span>
                      <span className="bg-white/10 px-3 py-1 rounded-md text-white/50">Queue Status: Low</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
                    <h4 className="font-bold text-green-400 mb-4">Required Documents</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /> Voter ID Card (EPIC)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /> Voter Slip (Optional)</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                    <h4 className="font-bold text-red-400 mb-4">Strictly Prohibited</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-400" /> Mobile Phones</li>
                      <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-400" /> Cameras</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
