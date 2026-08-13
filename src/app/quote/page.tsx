"use client";

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Mail, Settings, User, Building, Phone, Send, Info, ChevronRight } from "lucide-react";

export default function QuotePage() {
  const [rfqType, setRfqType] = useState<'automation' | 'manufacturing'>('automation');
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  
  // Checklist states
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleRfqTypeChange = (type: 'automation' | 'manufacturing') => {
    setRfqType(type);
    setSelectedServices([]); // reset selected capabilities when changing types
  };

  const automationServices = [
    "Robotic Workcells & Integration",
    "Machine Vision & Inspection",
    "Safety Engineering & Safeguarding",
    "PLC & Control System Programming",
    "Industrial Retrofits & Upgrades"
  ];

  const manufacturingServices = [
    "Precision CNC Machining",
    "Sheet Metal Fabrication",
    "PCB Assembly (SMT & Through-Hole)",
    "Electromechanical Box Builds",
    "Custom Wire Harnesses & Cabling"
  ];

  const activeServicesList = rfqType === 'automation' ? automationServices : manufacturingServices;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email || !description) return;
    setIsSubmitted(true);
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
           <h1 className="text-5xl font-black font-display tracking-tighter uppercase leading-none">RFQ <span className="text-emerald-500">Submitted</span></h1>
           <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
              "Your Request for Quote for {rfqType === 'automation' ? 'Automation Systems' : 'Contract Manufacturing'} has been successfully registered. An applications engineer will contact you at <span className="text-white font-black">{email}</span> within 24 business hours to discuss your technical specifications."
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
             onClick={() => {
               setIsSubmitted(false);
               setName("");
               setCompany("");
               setEmail("");
               setPhone("");
               setProjectTitle("");
               setDescription("");
               setBudget("");
               setTimeline("");
               setSelectedServices([]);
             }}
             className={`px-8 py-3 rounded-xl text-slate-950 font-black uppercase tracking-widest text-[10px] transition-all font-display ${rfqType === 'automation' ? 'bg-sky-400 hover:bg-sky-300' : 'bg-emerald-400 hover:bg-emerald-300'}`}
           >
             Submit Another RFQ
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      
      <main className="pt-[110px] max-w-4xl mx-auto px-6 py-12 pb-24 w-full">
        <div className="space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Settings className="w-3 h-3" /> REQUEST FOR QUOTE [V3.0]
             </div>
             <h1 className="text-4xl md:text-6xl font-black font-display tracking-tighter uppercase leading-none">
                Submit an <span className={rfqType === 'automation' ? 'text-sky-400' : 'text-emerald-400'}>RFQ</span>
             </h1>
             <p className="text-slate-500 max-w-xl mx-auto text-base font-medium leading-relaxed italic">
                "Direct pipeline to our technical division. Select your vertical below and fill out our simplified RFQ model."
             </p>
          </header>

          {/* Type Selector Toggle */}
          <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 max-w-md mx-auto">
            <button 
              type="button"
              onClick={() => handleRfqTypeChange('automation')}
              className={`flex-1 py-3 text-center rounded-xl font-bold font-display text-xs uppercase tracking-wider transition-all duration-300 ${rfqType === 'automation' ? 'bg-sky-500 text-slate-950 shadow-[0_4px_20px_rgba(14,165,233,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Automation Systems
            </button>
            <button 
              type="button"
              onClick={() => handleRfqTypeChange('manufacturing')}
              className={`flex-1 py-3 text-center rounded-xl font-bold font-display text-xs uppercase tracking-wider transition-all duration-300 ${rfqType === 'manufacturing' ? 'bg-emerald-500 text-slate-950 shadow-[0_4px_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Contract Manufacturing
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass p-8 md:p-12 space-y-8 bg-slate-900/20 border-white/5 relative overflow-hidden max-w-2xl mx-auto">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${rfqType === 'automation' ? 'bg-sky-500' : 'bg-emerald-500'} opacity-50`} />

            {/* Step Heading */}
            <div className="space-y-1 pb-4 border-b border-white/5">
              <h3 className="text-xl font-bold text-white uppercase font-display tracking-tight">
                {rfqType === 'automation' ? 'Automation Project Details' : 'Manufacturing Production Run'}
              </h3>
              <p className="text-xs text-slate-500">Please populate the credentials and specifications for the submission.</p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> Company Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Acme Industries"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="engineer@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Checklist of services */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Capabilities Requested <span className="text-slate-600">(Select all that apply)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeServicesList.map((service, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-bold transition-all duration-300 ${
                      selectedServices.includes(service)
                        ? rfqType === 'automation'
                          ? 'border-sky-500 bg-sky-500/5 text-sky-400'
                          : 'border-emerald-500 bg-emerald-500/5 text-emerald-400'
                        : 'border-white/5 bg-slate-950/20 text-slate-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      selectedServices.includes(service)
                        ? rfqType === 'automation' ? 'border-sky-500 bg-sky-500 text-slate-950' : 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-700 bg-transparent'
                    }`}>
                      {selectedServices.includes(service) && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                    </div>
                    <span>{service}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Timeline Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Budget Estimate</label>
                <select 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium"
                >
                  <option value="" className="text-slate-500">Select budget scale...</option>
                  <option value="under-25">Under $25,000</option>
                  <option value="25-100">$25,000 - $100,000</option>
                  <option value="100-250">$100,000 - $250,000</option>
                  <option value="over-250">$250,000+</option>
                </select>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Desired Timeline</label>
                <select 
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium"
                >
                  <option value="" className="text-slate-500">Select timeline urgency...</option>
                  <option value="immediate">Immediate (&lt; 1 Month)</option>
                  <option value="short">Standard (1 - 3 Months)</option>
                  <option value="planning">Budgeting & Planning Phase</option>
                </select>
              </div>
            </div>

            {/* Project Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project Subject / Run Title</label>
              <input 
                type="text" 
                placeholder="e.g. SMT PCB Production or Assembly Cell Safeguarding"
                value={subject}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Project Specifications & Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                required
                rows={5}
                placeholder="Describe your project, technical specs, estimated quantity, CAD links, and specific hardware requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-sky-500 transition-all text-sm font-medium leading-relaxed resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={!name || !company || !email || !description}
                className={`w-full md:w-auto h-12 px-8 flex items-center justify-center gap-2 rounded-xl text-slate-950 font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-30 ${
                  rfqType === 'automation'
                    ? 'bg-sky-400 hover:bg-sky-300 hover:shadow-[0_10px_20px_rgba(14,165,233,0.2)]'
                    : 'bg-emerald-400 hover:bg-emerald-300 hover:shadow-[0_10px_20px_rgba(16,185,129,0.2)]'
                }`}
              >
                <span>Submit RFQ Specifications</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
