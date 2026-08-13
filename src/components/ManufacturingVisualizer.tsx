"use client";

import { InventoryItem } from "@/lib/inventory";

interface ManufacturingVisualizerProps {
  fabrication: InventoryItem | null;
  pcba: InventoryItem | null;
  assembly: InventoryItem[];
}

export default function ManufacturingVisualizer({ fabrication, pcba, assembly }: ManufacturingVisualizerProps) {
  if (!fabrication) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-emerald-400 gap-4">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse">Select fabrication to initialize model</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center scale-75 origin-center">
      {/* 3D Spinning Production Bed */}
      <div className="absolute bottom-[60px] w-52 h-4 bg-slate-800 rounded-lg shadow-2xl border border-white/10 flex items-center justify-center">
        <div className="w-full h-[2px] bg-emerald-500/20 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Fabrication CNC spindle / Laser Head */}
        <div className="relative w-16 h-16 bg-slate-900 border-2 border-emerald-500/30 rounded-xl flex items-center justify-center group-hover:border-emerald-400 transition-all duration-500">
          <span className="text-2xl animate-bounce duration-1000">{fabrication.icon}</span>
          
          {/* Laser beam or Toolpath guides */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-[50px] bg-gradient-to-b from-emerald-500 to-transparent opacity-70 animate-pulse" />
        </div>

        {/* PCB assembly frame */}
        {pcba && (
          <div className="relative w-28 h-20 bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-2 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500">
            {/* Spinning SMT chips */}
            <div className="flex justify-between">
              <div className="w-3 h-3 bg-emerald-400/80 rounded-sm animate-ping" />
              <div className="w-4 h-3 bg-slate-800 border border-emerald-400/50 rounded-sm" />
              <div className="w-3 h-3 bg-yellow-500/60 rounded-full" />
            </div>
            
            {/* Glowing tracer lines representing SMT routes */}
            <div className="h-[2px] bg-gradient-to-r from-emerald-400 to-transparent w-full animate-pulse" />
            
            <div className="flex justify-between items-center text-[7px] font-mono text-emerald-400">
              <span>SMT ACTIVE</span>
              <span>{pcba.model.includes('SMT') ? 'SMD_H5' : 'THT_W1'}</span>
            </div>
          </div>
        )}

        {/* Turnkey Box Build/Harness visual indicators */}
        {assembly.length > 0 && (
          <div className="absolute -bottom-8 -left-6 -right-6 flex justify-around gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {assembly.map((item, idx) => (
              <div key={idx} className="px-2 py-1 bg-slate-900 border border-emerald-500/20 rounded-md text-[8px] font-mono text-emerald-400 flex items-center gap-1 shadow-lg">
                <span>{item.icon}</span>
                <span className="uppercase tracking-tight">{item.category} OK</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid Pattern Background for that high-fidelity industrial CAD aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10" />
    </div>
  );
}
