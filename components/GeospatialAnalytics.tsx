"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Activity, Users, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for the Map
const STATE_DATA = [
  { id: "MH", name: "Maharashtra", seats: 48, status: "Active", turnout: "61.3%" },
  { id: "UP", name: "Uttar Pradesh", seats: 80, status: "Pending", turnout: "--" },
  { id: "WB", name: "West Bengal", seats: 42, status: "Active", turnout: "78.2%" },
  { id: "TG", name: "Telangana", seats: 17, status: "Complete", turnout: "65.6%" },
  { id: "KA", name: "Karnataka", seats: 28, status: "Complete", turnout: "70.1%" },
];

export default function GeospatialAnalytics() {
  const [activeState, setActiveState] = useState(STATE_DATA[0]);

  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-6">
      {/* Map Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Map className="h-6 w-6 text-sana" />
              Geospatial Analytics
            </h2>
            <p className="text-white/50 text-sm">Interactive ECI State-wise Data Intelligence.</p>
          </div>
          <div className="flex items-center gap-2 bg-sana/10 px-4 py-2 rounded-full border border-sana/20 text-sana text-xs font-bold uppercase tracking-widest">
            <Activity className="h-4 w-4 animate-pulse" /> Live Uplink
          </div>
        </div>

        <div className="flex-1 relative border border-dashed border-white/20 rounded-2xl flex items-center justify-center bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/India_map_en.svg')] bg-contain bg-no-repeat bg-center opacity-40">
          {/* Interactive Map Pins overlaying the SVG */}
          {STATE_DATA.map((state, idx) => (
            <motion.div
              key={state.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveState(state)}
              className={cn(
                "absolute cursor-pointer flex flex-col items-center group transition-all",
                // Positioning mock logic
                state.id === "MH" ? "top-[50%] left-[30%]" :
                state.id === "UP" ? "top-[30%] left-[50%]" :
                state.id === "WB" ? "top-[40%] right-[20%]" :
                state.id === "TG" ? "bottom-[40%] left-[45%]" :
                "bottom-[30%] left-[35%]"
              )}
            >
              <div className={cn(
                "h-4 w-4 rounded-full border-2 transition-all",
                activeState.id === state.id ? "bg-sana border-black scale-125 shadow-[0_0_15px_rgba(163,255,0,0.5)]" : "bg-white/20 border-white/50 group-hover:bg-sana/50"
              )} />
              <div className="absolute top-6 opacity-0 group-hover:opacity-100 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap transition-opacity">
                {state.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* State Details Panel */}
      <div className="w-full xl:w-96 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeState.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
              <h3 className="text-2xl font-black text-white">{activeState.name}</h3>
              <span className={cn(
                "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                activeState.status === "Active" ? "bg-sana/20 text-sana border border-sana/30" :
                activeState.status === "Complete" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                "bg-white/10 text-white/50 border border-white/20"
              )}>
                {activeState.status}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white/50" />
                </div>
                <div>
                  <div className="text-sm text-white/50">Lok Sabha Seats</div>
                  <div className="text-xl font-bold text-white">{activeState.seats}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white/50" />
                </div>
                <div>
                  <div className="text-sm text-white/50">Voter Turnout</div>
                  <div className="text-xl font-bold text-white">{activeState.turnout}</div>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              View Detailed Analytics <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="bg-sana/10 border border-sana/20 rounded-3xl p-6 flex flex-col justify-center">
          <FileText className="h-8 w-8 text-sana mb-4" />
          <h4 className="text-white font-bold mb-2">ECI Documentation</h4>
          <p className="text-white/60 text-sm mb-4">
            Access official Election Commission of India guidelines and schedules for this region.
          </p>
          <button className="text-xs font-bold text-sana uppercase tracking-widest hover:underline flex items-center gap-1">
            Access Database <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
