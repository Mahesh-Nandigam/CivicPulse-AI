"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SanaVisualizer() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Outer Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-sana/20 rounded-full blur-[60px]"
      />
      
      {/* Main Robotic Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border-2 border-sana/30 border-dashed rounded-full"
      />

      {/* Inner Tech Ring */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-10 border border-sana/50 rounded-full flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-sana rounded-full absolute top-0 shadow-[0_0_10px_#a3ff00]" />
      </motion.div>

      {/* Core Avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            y: [-5, 5, -5],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 md:w-56 md:h-56"
        >
          <div className="w-full h-full relative group">
            <img 
              src="/civic_ai_mascot_1777485189967.png" 
              alt="Sana AI" 
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(163,255,0,0.4)] transition-opacity duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.querySelector('.fallback-avatar')?.classList.remove('hidden');
              }}
            />
            {/* Fallback Avatar UI */}
            <div className="fallback-avatar hidden absolute inset-0 flex items-center justify-center bg-sana/10 rounded-full border border-sana/30 shadow-[0_0_30px_rgba(163,255,0,0.2)]">
               <div className="h-24 w-24 rounded-full bg-sana/20 animate-pulse flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-sana/40 animate-ping" />
               </div>
            </div>
          </div>
          
          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-sana/40 shadow-[0_0_10px_#a3ff00] z-10"
          />
        </motion.div>
      </div>

      {/* HUD Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-black text-sana/40 uppercase tracking-[0.5em]">
          Neural Link Active
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-black text-sana/40 uppercase tracking-[0.5em]">
          Intelligence v2.0
        </div>
      </div>
    </div>
  );
}
