"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, WifiOff, ServerCrash } from "lucide-react";

export default function ChaosModeOverlay() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-red-900/10 backdrop-blur-sm mix-blend-color-burn" />
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay pointer-events-none" />

      {/* Red Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-black/80 border border-red-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.2)] max-w-lg w-full flex flex-col items-center text-center pointer-events-auto"
      >
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
          >
            <ShieldAlert className="h-20 w-20 text-red-500" />
          </motion.div>
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
        </div>

        <h2 className="text-3xl font-black uppercase tracking-widest text-red-500 mb-2">Simulated Outage</h2>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 justify-center">
          <ServerCrash className="h-5 w-5" /> Cloud Sync Failed
        </h3>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8 text-left w-full space-y-3">
          <div className="flex items-center gap-3 text-red-400">
            <WifiOff className="h-5 w-5 shrink-0" />
            <span className="text-sm font-mono">CONNECTION: SEVERED</span>
          </div>
          <div className="flex items-center gap-3 text-yellow-500">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-mono">FALLBACK: ACTIVATED</span>
          </div>
        </div>

        <p className="text-white/70 mb-8 text-sm leading-relaxed">
          The Sana Engine has detected a critical network failure. RAG pipelines are offline. 
          The system has seamlessly switched to its local persistence layer. Core functionality remains intact.
        </p>

        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, ease: "linear" }}
            className="h-full bg-red-500"
          />
        </div>
        <p className="text-xs font-mono text-red-500/50 mt-2 uppercase tracking-widest">
          Auto-recovery initiating...
        </p>
      </motion.div>
    </motion.div>
  );
}
