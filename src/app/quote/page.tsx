"use client";

import { useState, useMemo } from 'react';
import Navbar from "@/components/Navbar";
import RobotVisualizer from "@/components/RobotVisualizer";
import { inventory, InventoryItem } from "@/lib/inventory";
import { ChevronRight, ChevronLeft, CheckCircle2, Mail, Settings, Bot, Eye, Shield } from "lucide-react";

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [selectedRobot, setSelectedRobot] = useState<InventoryItem | null>(null);
  const [selectedVision, setSelectedVision] = useState<InventoryItem | null>(null);
  const [selectedSafety, setSelectedSafety] = useState<InventoryItem[]>([]);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const total = useMemo(() => {
    let t = 0;
    if (selectedRobot) t += selectedRobot.price;
    if (selectedVision) t += selectedVision.price;
    selectedSafety.forEach(s => t += s.price);
    return t;
  }, [selectedRobot, selectedVision, selectedSafety]);

  const toggleSafety = (item: InventoryItem) => {
    setSelectedSafety(prev => 
      prev.find(s => s.id === item.id) 
        ? prev.filter(s => s.id !== item.id)
        : [...prev, item]
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5">
            <div className="space-y-2">
               <h2 className="text-2xl font-black font-display uppercase tracking-tight">Base Unit Selection</h2>
               <p className="text-slate-500 text-sm">Select the core kinetic module for your automation cell.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {inventory.filter(i => i.category === 'Robot').map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedRobot(item)}
                  className={`group relative glass p-8 text-left transition-all duration-500 overflow-hidden ${
                    selectedRobot?.id === item.id ? "border-sky-500 bg-sky-500/5" : "hover:border-white/20"
                  }`}
                >
                  <div className={`absolute top-0 right-0 p-4 transition-opacity ${selectedRobot?.id === item.id ? 'opacity-100' : 'opacity-0'}`}>
                     <CheckCircle2 className="w-5 h-5 text-sky-500" />
                  </div>
                  <span className="text-4xl mb-6 block transform group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
                  <div className="space-y-1">
                     <h3 className="font-black font-display text-xl uppercase tracking-tight">{item.model}</h3>
                     <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-end">
                     <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Base Investment</span>
                     <span className="text-xl font-black text-sky-400 font-display">${item.price.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5">
            <div className="space-y-2">
               <h2 className="text-2xl font-black font-display uppercase tracking-tight">Optical Intelligence</h2>
               <p className="text-slate-500 text-sm">Integrate advanced machine vision for precise inspection and guidance.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {inventory.filter(i => i.category === 'Vision').map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedVision(item)}
                  className={`group relative glass p-8 text-left transition-all duration-500 overflow-hidden ${
                    selectedVision?.id === item.id ? "border-sky-500 bg-sky-500/5" : "hover:border-white/20"
                  }`}
                >
                  <div className={`absolute top-0 right-0 p-4 transition-opacity ${selectedVision?.id === item.id ? 'opacity-100' : 'opacity-0'}`}>
                     <CheckCircle2 className="w-5 h-5 text-sky-500" />
                  </div>
                  <span className="text-4xl mb-6 block transform group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
                  <div className="space-y-1">
                     <h3 className="font-black font-display text-xl uppercase tracking-tight">{item.model}</h3>
                     <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-end">
                     <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Sensing Cost</span>
                     <span className="text-xl font-black text-sky-400 font-display">${item.price.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5">
            <div className="flex justify-between items-end">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black font-display uppercase tracking-tight">Safety Engineering</h2>
                  <p className="text-slate-500 text-sm">Select critical safety components for machine safeguarding.</p>
               </div>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Multi-Select Enabled</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {inventory.filter(i => i.category === 'Safety').map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleSafety(item)}
                  className={`group relative glass p-8 text-left transition-all duration-500 overflow-hidden ${
                    selectedSafety.find(s => s.id === item.id) ? "border-emerald-500 bg-emerald-500/5 text-emerald-400" : "hover:border-white/20"
                  }`}
                >
                  <div className={`absolute top-0 right-0 p-4 transition-opacity ${selectedSafety.find(s => s.id === item.id) ? 'opacity-100' : 'opacity-0'}`}>
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-4xl mb-6 block transform group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
                  <div className="space-y-1">
                     <h3 className="font-black font-display text-xl uppercase tracking-tight">{item.model}</h3>
                     <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-end">
                     <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Hardware Cost</span>
                     <span className={`text-xl font-black font-display ${selectedSafety.find(s => s.id === item.id) ? 'text-emerald-400' : 'text-sky-400'}`}>
                        ${item.price.toLocaleString()}
                     </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5">
            <div className="space-y-2">
               <h2 className="text-2xl font-black font-display uppercase tracking-tight">Finalize Module</h2>
               <p className="text-slate-500 text-sm">Review your technical selection and authorize the baseline study.</p>
            </div>
            
            <div className="space-y-6">
              <div className="glass p-8 space-y-6 bg-slate-900/40 border-white/5">
                <ReviewItem label="Kinetic Module" value={selectedRobot?.model} price={selectedRobot?.price} />
                <ReviewItem label="Vision Architecture" value={selectedVision?.model} price={selectedVision?.price} />
                {selectedSafety.map(s => (
                   <ReviewItem key={s.id} label="Safety Hardware" value={s.model} price={s.price} />
                ))}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Engineering Contact Point</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-sky-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                     <input 
                       type="email" 
                       placeholder="engineer@company.com"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium"
                     />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-12">
        <div className="relative">
           <div className="absolute -inset-8 bg-emerald-500/20 blur-3xl opacity-50 animate-pulse" />
           <div className="relative bg-emerald-500/10 p-8 rounded-[2.5rem] border border-emerald-500/20">
              <CheckCircle2 className="w-20 h-20 text-emerald-500" />
           </div>
        </div>
        
        <div className="space-y-4 max-w-xl">
           <h1 className="text-5xl font-black font-display tracking-tighter uppercase leading-none">Transmission <span className="text-emerald-500">Successful</span></h1>
           <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
              "Your budgetary configuration has been transmitted. A technical representative will engage at <span className="text-white font-black">{email}</span> within 24 operational hours."
           </p>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={() => window.location.href = '/'}
             className="px-8 py-3 rounded-xl border border-white/5 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-white hover:border-white/20 transition-all font-display"
           >
             Return to Base
           </button>
           <button 
             onClick={() => setIsSubmitted(false)}
             className="px-8 py-3 rounded-xl bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] hover:bg-sky-400 transition-all font-display"
           >
             New Configuration
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <Navbar />
      
      <main className="pt-[100px] max-w-7xl mx-auto px-6 py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          {/* Left Column: Form & Logic */}
          <div className="space-y-10">
            <header className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Settings className="w-3 h-3" /> System Configurator v2.4
               </div>
               <h1 className="text-5xl font-black font-display tracking-tighter uppercase leading-none">
                  Configure <span className="text-sky-400">Solution</span>
               </h1>
               <p className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed italic">
                  "Building the foundation of industrial autonomy through precise module selection."
               </p>
            </header>

            {/* High-Fidelity Step Indicator */}
            <div className="relative flex items-center justify-between max-w-2xl px-2">
               <div className="absolute top-[24px] left-0 w-full h-[1px] bg-white/5 -z-10" />
               <div 
                  className="absolute top-[24px] left-0 h-[2px] bg-sky-500 transition-all duration-700 -z-10 shadow-[0_0_15px_rgba(14,165,233,0.5)]" 
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
               />
               
               {[
                 { id: 1, label: 'CORE', icon: Bot },
                 { id: 2, label: 'VISION', icon: Eye },
                 { id: 3, label: 'SECURITY', icon: Shield },
                 { id: 4, label: 'FINALIZE', icon: CheckCircle2 }
               ].map((s) => (
                 <div key={s.id} className="flex flex-col items-center gap-3" onClick={() => (step > s.id) && setStep(s.id)}>
                    <div 
                       className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 cursor-pointer ${
                         step >= s.id 
                         ? 'bg-slate-950 border-sky-500 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.2)]' 
                         : 'bg-slate-900 border-white/5 text-slate-700'
                       }`}
                    >
                       <s.icon className={`w-5 h-5 ${step === s.id ? 'animate-pulse' : ''}`} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${step >= s.id ? 'text-white' : 'text-slate-700'}`}>
                       {s.label}
                    </span>
                 </div>
               ))}
            </div>

            <div className="min-h-[500px] pt-4">
              {renderStep()}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-10 border-t border-white/5">
              <button 
                onClick={() => setStep(prev => prev - 1)}
                disabled={step === 1}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-white/5 text-slate-500 hover:text-white hover:border-white/20 transition-all disabled:opacity-20"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest font-display">Previous Module</span>
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={() => setStep(prev => prev + 1)}
                  disabled={(step === 1 && !selectedRobot) || (step === 2 && !selectedVision)}
                  className="btn-primary"
                >
                  <span className="font-display">Confirm & Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsSubmitted(true)}
                  disabled={!email}
                  className="h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] uppercase tracking-widest text-[10px] disabled:opacity-30 font-display"
                >
                  Execute Quotation Protocol
                </button>
              )}
            </div>
          </div>

          {/* Right Column: CAD Preview & Estimate Summary */}
          <div className="space-y-8 lg:sticky lg:top-[120px]">
            {/* CAD frame visualizer */}
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative h-[400px] glass bg-slate-950/80 rounded-[2rem] border-white/5 overflow-hidden flex flex-col">
                  {/* Decorative terminal elements */}
                  <div className="flex items-center justify-between p-6 border-b border-white/5">
                     <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                     </div>
                     <div className="text-[10px] font-mono text-sky-500/50 uppercase tracking-widest animate-pulse">Live Visualizer [V3.9]</div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center relative bg-slate-950/20">
                     <RobotVisualizer 
                        robot={selectedRobot} 
                        vision={selectedVision} 
                        safety={selectedSafety} 
                     />
                     
                     {/* HUD Overlays */}
                     <div className="absolute bottom-6 left-6 text-[8px] font-mono text-slate-600 leading-tight">
                        ORIENTATION: [X: 124.5, Y: -45.0]<br />
                        LOAD_CAP: [95% CAPACITY]<br />
                        SYST_INTEG: [OPTIMIZED]
                     </div>
                  </div>
               </div>
            </div>

            {/* Budgetary summary */}
            <div className="glass p-8 space-y-8 border-sky-500/10 bg-slate-900/40 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Shield className="w-20 h-20 text-sky-500 -rotate-12" />
               </div>

               <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Budgetary Proposal</h3>
                  <p className="text-2xl font-black font-display tracking-tight text-white uppercase leading-none">System Summary</p>
               </div>
               
               <div className="space-y-3 min-h-[140px]">
                 {selectedRobot || selectedVision || selectedSafety.length > 0 ? (
                   <div className="space-y-3">
                     {selectedRobot && <SummaryLine item={selectedRobot} />}
                     {selectedVision && <SummaryLine item={selectedVision} />}
                     {selectedSafety.map(s => <SummaryLine key={s.id} item={s} />)}
                   </div>
                 ) : (
                   <div className="py-12 text-center space-y-3 opacity-20">
                      <Settings className="w-8 h-8 mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Module Input</p>
                   </div>
                 )}
               </div>

               <div className="pt-8 border-t border-white/5 space-y-4">
                 <div className="space-y-1">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Projected Investment</span>
                       <span className="text-xs text-sky-500 font-bold uppercase tracking-widest">USD (Net)</span>
                    </div>
                    <div className="text-5xl font-black text-sky-400 tracking-tighter font-display leading-none">
                       ${total.toLocaleString()}<span className="text-lg text-slate-700 font-mono">.00</span>
                    </div>
                 </div>
                 <p className="text-[9px] text-slate-600 font-medium leading-relaxed italic border-l border-sky-500/30 pl-3">
                    This summary represents an engineering estimate. Final hardware selection may vary based on deployment environment.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryLine({ item }: { item: InventoryItem }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-300 font-medium">{item.model}</span>
      <span className="font-mono text-slate-500 text-xs">${item.price.toLocaleString()}</span>
    </div>
  );
}

function ReviewItem({ label, value, price }: { label: string, value?: string, price?: number }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-3">
      <div>
        <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">{label}</div>
        <div className="font-bold font-display uppercase tracking-tight text-sm text-white">{value}</div>
      </div>
      <div className="font-mono text-sky-500 text-xs font-bold bg-sky-500/10 px-2 py-1 rounded-md border border-sky-500/20">
        ${price?.toLocaleString()}
      </div>
    </div>
  );
}
