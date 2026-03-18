"use client";

import { useState, useMemo } from 'react';
import Navbar from "@/components/Navbar";
import RobotVisualizer from "@/components/RobotVisualizer";
import { inventory, InventoryItem } from "@/lib/inventory";
import { ChevronRight, ChevronLeft, CheckCircle2, Mail } from "lucide-react";

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
          <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
            <h2 className="text-2xl font-bold font-display">Select a Base Robot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inventory.filter(i => i.category === 'Robot').map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedRobot(item)}
                  className={`glass p-6 text-left transition-all hover:border-sky-500/50 ${
                    selectedRobot?.id === item.id ? "border-sky-500 bg-sky-500/10 ring-1 ring-sky-500" : ""
                  }`}
                >
                  <span className="text-3xl mb-2 block">{item.icon}</span>
                  <h3 className="font-bold text-lg">{item.model}</h3>
                  <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                  <span className="text-sky-400 font-bold">${item.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
            <h2 className="text-2xl font-bold font-display">Vision & Sensing Systems</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inventory.filter(i => i.category === 'Vision').map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedVision(item)}
                  className={`glass p-6 text-left transition-all hover:border-sky-500/50 ${
                    selectedVision?.id === item.id ? "border-sky-500 bg-sky-500/10 ring-1 ring-sky-500" : ""
                  }`}
                >
                  <span className="text-3xl mb-2 block">{item.icon}</span>
                  <h3 className="font-bold text-lg">{item.model}</h3>
                  <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                  <span className="text-sky-400 font-bold">${item.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
            <div className="flex justify-between items-end">
               <h2 className="text-2xl font-bold font-display">Safety Hardware</h2>
               <p className="text-slate-500 text-sm">Select multiple if needed</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inventory.filter(i => i.category === 'Safety').map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleSafety(item)}
                  className={`glass p-6 text-left transition-all hover:border-sky-500/50 ${
                    selectedSafety.find(s => s.id === item.id) ? "border-sky-500 bg-sky-500/10 ring-1 ring-sky-500" : ""
                  }`}
                >
                  <span className="text-3xl mb-2 block">{item.icon}</span>
                  <h3 className="font-bold text-lg">{item.model}</h3>
                  <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                  <span className="text-sky-400 font-bold">${item.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5">
            <h2 className="text-2xl font-bold font-display">Finalize Your Request</h2>
            
            <div className="space-y-4">
              <div className="glass p-6 space-y-4">
                <ReviewItem label="Robot" value={selectedRobot?.model} price={selectedRobot?.price} />
                <ReviewItem label="Vision" value={selectedVision?.model} price={selectedVision?.price} />
                {selectedSafety.map(s => (
                   <ReviewItem key={s.id} label="Safety" value={s.model} price={s.price} />
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Project Email Contact</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="email" 
                    placeholder="engineer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="bg-emerald-500/20 p-4 rounded-full">
           <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-bold font-display">Quote Requested!</h1>
        <p className="text-slate-400 max-w-md">
          Your budgetary configuration has been submitted. Our engineering team will review it and contact you at <span className="text-white font-medium">{email}</span>.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="btn-primary mt-8"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-[70px] max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        {/* Left Column: Form */}
        <div className="space-y-8">
          <header className="space-y-2">
             <h1 className="text-4xl font-black font-display tracking-tight">System <span className="text-sky-400">Configurator</span></h1>
             <p className="text-slate-400">Follow the steps below to design your automated solution.</p>
          </header>

          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4">
             {[1, 2, 3, 4].map(s => (
               <div key={s} className="flex items-center gap-2 shrink-0">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                   step >= s ? "bg-sky-500 text-slate-950" : "bg-slate-800 text-slate-500"
                 }`}>
                   {s}
                 </div>
                 {s < 4 && <div className={`w-12 h-[2px] ${step > s ? "bg-sky-500" : "bg-slate-800"}`} />}
               </div>
             ))}
          </div>

          <div className="min-h-[400px]">
            {renderStep()}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <button 
              onClick={() => setStep(prev => prev - 1)}
              disabled={step === 1}
              className="px-6 py-2 rounded-lg font-medium text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            {step < 4 ? (
              <button 
                onClick={() => setStep(prev => prev + 1)}
                disabled={(step === 1 && !selectedRobot) || (step === 2 && !selectedVision)}
                className="btn-primary"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => setIsSubmitted(true)}
                disabled={!email}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                Submit Quote Request
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="space-y-6">
          <div className="glass h-[300px] bg-slate-900/50 relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">Live Engine Visualizer</div>
            <RobotVisualizer 
              robot={selectedRobot} 
              vision={selectedVision} 
              safety={selectedSafety} 
            />
          </div>

          <div className="glass p-6 space-y-6">
            <h3 className="font-bold text-lg uppercase tracking-wider text-slate-500 text-xs">Estimate Summary</h3>
            
            <div className="space-y-3 min-h-[100px]">
              {selectedRobot || selectedVision || selectedSafety.length > 0 ? (
                <>
                  {selectedRobot && <SummaryLine item={selectedRobot} />}
                  {selectedVision && <SummaryLine item={selectedVision} />}
                  {selectedSafety.map(s => <SummaryLine key={s.id} item={s} />)}
                </>
              ) : (
                <p className="text-slate-600 text-sm italic">No components selected yet...</p>
              )}
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Projected Total</div>
              <div className="text-4xl font-black text-sky-400 tracking-tighter">${total.toLocaleString()}</div>
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
      <span className="text-slate-300">{item.model}</span>
      <span className="font-mono text-slate-500">${item.price.toLocaleString()}</span>
    </div>
  );
}

function ReviewItem({ label, value, price }: { label: string, value?: string, price?: number }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center decoration-dotted border-b border-white/5 pb-2">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
      <div className="font-mono text-sky-500">${price?.toLocaleString()}</div>
    </div>
  );
}
