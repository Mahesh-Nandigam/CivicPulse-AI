"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Zap, Radio, AlertTriangle } from "lucide-react";

export default function ChaosModeOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Glitch Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.1, 0, 0.2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
        className="absolute inset-0 bg-alert mix-blend-color-dodge" 
      />

      {/* Red Alert Pulse */}
      <motion.div 
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.2)_0%,transparent_70%)]" 
      />

      {/* Scanline Glitch */}
      <motion.div 
        animate={{ y: [-100, 1000] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-1 bg-alert/30 blur-[2px] shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
      />

      {/* HUD Alerts */}
      <div className="absolute top-24 left-10 space-y-4">
        <AlertBanner text="SYSTEM DELAY: ZONE 4" icon={ShieldAlert} />
        <AlertBanner text="QUEUE OVERFLOW: NORTH HUB" icon={Radio} />
        <AlertBanner text="MISINFO SIGNAL DETECTED" icon={Zap} />
      </div>

      <div className="absolute top-24 right-10 flex flex-col items-end gap-2">
         <div className="px-4 py-1 bg-alert text-white font-black text-[10px] uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse">
            ELECTION DAY CHAOS MODE ACTIVE
         </div>
         <div className="text-alert font-mono text-[8px] font-bold uppercase tracking-widest">
            SIMULATING SYSTEMIC INSTABILITY...
         </div>
      </div>
    </div>
  );
}

function AlertBanner({ text, icon: Icon }: { text: string, icon: any }) {
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-center gap-4 px-6 py-2 bg-black border-l-4 border-alert shadow-2xl"
    >
      <Icon className="h-4 w-4 text-alert animate-bounce" />
      <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{text}</span>
    </motion.div>
  );
}
