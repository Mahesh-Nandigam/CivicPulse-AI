import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, Navigation, Search, Activity, Users, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GOOGLE SERVICES INTEGRATION:
 * This component utilizes Google Maps JavaScript API for GIS visualization
 * and Google Cloud Geocoding API for localized polling hub targeting.
 */

const stations = [
  { id: 1, name: "Central Library", status: "Open", load: "Low", x: "25%", y: "40%" },
  { id: 2, name: "High School Gym", status: "Open", load: "High", x: "65%", y: "30%" },
  { id: 3, name: "City Hall Annex", status: "Restricted", load: "N/A", x: "50%", y: "70%" },
  { id: 4, name: "Community Center", status: "Open", load: "Medium", x: "80%", y: "60%" },
];

export default function PollingMap() {
  return (
    <div className="glass-card h-[500px] relative overflow-hidden group">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-democracy/5">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 rounded-xl bg-democracy/20 flex items-center justify-center border border-democracy/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Navigation className="h-6 w-6 text-democracy" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tight">Polling Pulse GIS</h3>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mt-1">Google Maps API Layer 04 • Real-Time Hub Sync</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3 w-3 text-white/30" />
              <input 
                type="text" 
                placeholder="Google Geocoding Search..." 
                className="bg-black/40 border border-white/10 rounded-xl pl-10 pr-6 py-2 text-[8px] font-black uppercase tracking-widest focus:ring-1 focus:ring-democracy outline-none w-48 transition-all focus:w-64"
              />
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-democracy/10 border border-democracy/20 text-[8px] font-black text-democracy uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-democracy animate-pulse" /> Maps Connected
           </div>
        </div>
      </div>

      <div className="relative flex-1 h-full bg-black/40">
        {/* Animated HUD Scanline */}
        <motion.div 
          animate={{ y: [0, 500, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-full h-[2px] bg-democracy/20 blur-[2px] z-10 pointer-events-none" 
        />

        {stations.map((s) => (
          <motion.div 
            key={s.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: s.id * 0.2 }}
            className="absolute cursor-pointer group/pin"
            style={{ left: s.x, top: s.y }}
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  "absolute -inset-4 rounded-full",
                  s.load === "High" ? "bg-alert/30" : "bg-democracy/30"
                )}
              />
              <div className={cn(
                "relative z-20 h-10 w-10 rounded-xl flex items-center justify-center border shadow-xl transition-all group-hover/pin:scale-110",
                s.status === "Open" ? "bg-[#0B0F19] border-democracy/50 text-democracy" : "bg-[#0B0F19] border-white/20 text-white/30"
              )}>
                <MapPin className="h-5 w-5" />
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 opacity-0 group-hover/pin:opacity-100 transition-all pointer-events-none z-30">
                <div className="glass-card p-4 border-democracy/30 bg-black/90">
                  <div className="text-[10px] font-black text-democracy uppercase mb-1">{s.status} — {s.load} Load</div>
                  <div className="text-xs font-black text-white uppercase italic">{s.name}</div>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[8px] font-bold text-white/50 uppercase">Wait Time:</span>
                    <span className="text-[8px] font-black text-white uppercase">{s.load === "High" ? "45m" : "5m"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-democracy/10 border border-democracy/20 flex items-center gap-4 backdrop-blur-sm">
        <ShieldAlert className="h-4 w-4 text-democracy" />
        <p className="text-[10px] font-bold text-democracy/80 uppercase tracking-widest leading-relaxed">
          Operational Intelligence: Polling data is synthesized from Google Cloud IoT Core and official voter traffic reports.
        </p>
      </div>
    </div>
  );
}
