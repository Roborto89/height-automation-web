"use client";

import { InventoryItem } from "@/lib/inventory";

interface RobotVisualizerProps {
  robot: InventoryItem | null;
  vision: InventoryItem | null;
  safety: InventoryItem[];
}

export default function RobotVisualizer({ robot, vision, safety }: RobotVisualizerProps) {
  if (!robot) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-sky-400 gap-4">
        <div className="w-10 h-10 border-2 border-sky-400 animate-spin" />
        <p className="text-sm font-medium animate-pulse">Select a robot to begin</p>
      </div>
    );
  }

  const robotColor = robot.model.includes('CRX') ? '#4ade80' : '#38bdf8';

  return (
    <div className="relative w-full h-full flex items-center justify-center scale-75 origin-center">
      <div className="absolute bottom-[60px] w-40 h-3 bg-slate-700 rounded-full shadow-2xl z-0" />
      
      {/* Robot Arm (Simplified CSS Visual) */}
      <div className="relative z-10">
        {/* Base Joint */}
        <div className="w-4 h-4 bg-white rounded-full relative z-20">
          {/* Link 1 */}
          <div 
            className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-3 rounded-full origin-bottom transition-all duration-500"
            style={{ height: '80px', backgroundColor: robotColor, transform: 'translateX(-50%) translateY(0) rotate(15deg)' }}
          >
            {/* Joint 2 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full -translate-y-1/2">
               {/* Link 2 */}
               <div 
                  className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-3 rounded-full origin-bottom transition-all duration-500"
                  style={{ height: '60px', backgroundColor: robotColor, transform: 'translateX(-50%) translateY(0) rotate(-45deg)' }}
               >
                  {/* Joint 3 */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full -translate-y-1/2">
                     {/* Link 3 */}
                     <div 
                        className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-3 rounded-full origin-bottom transition-all duration-500"
                        style={{ height: '40px', backgroundColor: robotColor, transform: 'translateX(-50%) translateY(0) rotate(30deg)' }}
                     >
                        {/* Tool Center Point / Camera */}
                        {vision && (
                          <div className="absolute -top-3 -left-1 w-6 h-4 bg-red-500 rounded shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Zone */}
      {safety.length > 0 && (
        <div className="absolute bottom-10 w-[300px] h-[180px] border-2 border-dashed border-yellow-500/40 bg-yellow-500/5 rounded-[50%] animate-pulse" />
      )}
    </div>
  );
}
