"use client";

import Navbar from "@/components/Navbar";
import { ArrowRight, Bot, Shield, Eye, Settings, Zap, Users, Globe, Play, X, Trophy, Briefcase } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <Navbar />
      
      <main className="pt-[70px]">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-6 flex flex-col items-center text-center overflow-hidden">
          {/* Advanced Background: Video Placeholder or Particle Simulation Overlay */}
          <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 grayscale" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/10 blur-[150px] rounded-full -z-10 animate-pulse" />
          
          <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-[0.2em]">
               <Zap className="w-3 h-3" /> System Status: Operational
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-display leading-[0.9]">
              ENGINEERING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-emerald-400">
                INDUSTRIAL SCALE
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Height Automation provides mission-critical robotic integration and 
              custom machine vision for the world's most demanding environments.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
              <Link href="/quote" className="btn-primary group h-14 px-10 text-lg">
                Initiate Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="h-14 px-10 rounded-xl font-bold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Reel
              </button>
            </div>
          </div>
        </section>

        {/* Corporate Trust Ribbon */}
        <div className="border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
           <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 py-10">
              {[
                { label: 'Systems Deployed', value: '120+', icon: Bot },
                { label: 'Support Uptime', value: '24/7', icon: Settings },
                { label: 'Safety Rating', value: '100%', icon: Shield },
                { label: 'Global Reach', value: '15 COUNTRIES', icon: Globe }
              ].map((stat, i) => (
                <div key={i} className="px-8 space-y-1 group hover:bg-white/5 transition-colors cursor-default py-4 md:py-0">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <stat.icon className="w-3 h-3 text-sky-500" /> {stat.label}
                   </p>
                   <p className="text-3xl font-black font-display tracking-tight text-white group-hover:text-sky-400 transition-colors">{stat.value}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Core Capabilities Showcase */}
        <section className="py-32 px-6 max-w-7xl mx-auto space-y-20">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-sky-500 pl-8">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black font-display tracking-tighter uppercase leading-none">Our Core <span className="text-sky-400">Verticals</span></h2>
                 <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                   From automotive assembly to aerospace inspection, we design and deploy 
                   high-availability systems that redefine efficiency.
                 </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                 Integrated Systems <span className="w-8 h-[1px] bg-slate-800" /> V.04 Revision
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { 
                  title: 'Robotic Integration', 
                  desc: 'Multi-axis robot integration for welding, pick-and-place, and assembly.',
                  icon: Bot,
                  bg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
                },
                { 
                  title: 'Machine Vision', 
                  desc: 'High-speed AI inspection and non-contact metrology systems.',
                  icon: Eye,
                  bg: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
                },
                { 
                  title: 'Safety Engineering', 
                  desc: 'ISO-compliant safety cells with laser scanner & light curtain logic.',
                  icon: Shield,
                  bg: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'
                }
              ].map((service, i) => (
                <div key={i} className="group relative glass aspect-[3/4] overflow-hidden flex flex-col justify-end p-8 border-white/5 hover:border-sky-500/50 transition-all">
                   <div className="absolute inset-0 w-full h-full -z-10">
                      <img src={service.bg} className="w-full h-full object-cover grayscale opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                         <service.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter">{service.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                         {service.desc}
                      </p>
                      <button className="text-[10px] font-black text-sky-400 uppercase tracking-widest pt-4 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                         Explore Tech <ArrowRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Brand/Partner Marquee (Social Proof) */}
        <section className="py-20 border-t border-white/5">
           <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Integrated with Industry Leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:opacity-100 transition-opacity duration-700">
                 {/* Mock Industrial Partner Logos */}
                 <div className="text-3xl font-black text-white italic">FANUC</div>
                 <div className="text-3xl font-black text-white">KEYENCE</div>
                 <div className="text-3xl font-black text-white uppercase tracking-tighter">Cognex</div>
                 <div className="text-3xl font-black text-white">ABB</div>
                 <div className="text-3xl font-black text-white">SICK</div>
              </div>
           </div>
        </section>

        {/* Technical Leadership / Personnel Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square">
                 <div className="absolute inset-0 bg-sky-500/20 blur-[100px] rounded-full" />
                 <img 
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" 
                    className="w-full h-full object-cover rounded-3xl grayscale border border-white/10 relative z-10" 
                    alt="Engineering Leadership" 
                 />
                 <div className="absolute -bottom-8 -right-8 glass p-8 bg-slate-900 z-20 space-y-2 border-sky-500/30">
                    <p className="text-3xl font-black text-white">25+</p>
                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest leading-tight">Years Combined <br />Technical Expertise</p>
                 </div>
              </div>
              
              <div className="space-y-8">
                 <div className="space-y-4">
                    <h2 className="text-5xl font-black font-display tracking-tighter uppercase">The Human <br /><span className="text-sky-400">Blueprint</span></h2>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed">
                       At Height Automation, we don't just sell software; we deploy veterans of industrial engineering. 
                       Our leadership team consists of specialists who have scaled factory floors from Detroit to Tokyo.
                    </p>
                 </div>
                 
                 <div className="space-y-6">
                    {[
                      { icon: Trophy, title: 'Certified Excellence', desc: 'ISO 9001 & RIOS certified safety standards.' },
                      { icon: Users, title: 'Dedicated Support', desc: 'Personalized engineering teams for every tier-1 partner.' },
                      { icon: Briefcase, title: 'Full Lifecycle', desc: 'From initial CAD design to 24/7 on-site maintenance.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 group">
                         <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-sky-400 group-hover:border-sky-500/30 transition-all">
                            <item.icon className="w-5 h-5" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="font-bold text-white text-lg">{item.title}</h4>
                            <p className="text-slate-500 text-sm">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Global Insight Section */}
        <section className="py-32 px-6 bg-sky-500/[0.02]">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20 items-center">
              <div className="space-y-6">
                 <h2 className="text-4xl font-black font-display tracking-tight uppercase leading-[0.9]">Field <br /> Intelligence</h2>
                 <p className="text-slate-400 text-lg">Detailed operation logs from our engineers deployed across the globe.</p>
                 <Link href="/blog" className="btn-primary inline-flex items-center gap-2 group">
                   Visit Intel Hub
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ring-1 ring-white/5 p-8 rounded-3xl bg-slate-900/10">
                 {[
                   { date: 'MAR 15', title: 'Advancing Collaborative Welding', category: 'ROBOTICS' },
                   { date: 'MAR 10', title: 'High-Speed Quality Assurance', category: 'VISION' }
                 ].map((post, i) => (
                   <div key={i} className="glass p-8 space-y-4 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{post.category}</span>
                         <span className="text-[10px] font-mono text-slate-600 uppercase">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-sky-400 transition-colors">{post.title}</h3>
                      <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        Read Log <ArrowRight className="w-3 h-3" />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      {/* Video Modal Overlay */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsVideoOpen(false)} />
           <div className="relative w-full max-w-6xl aspect-video bg-slate-900 rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl animate-in zoom-in duration-500">
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-slate-950/50 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Actual Video Embed - Using a high-quality industrial reel placeholder */}
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" // Placeholder video (Rick Roll for dev, or a real industry clip) 
                title="Height Automation Corporate Reel"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
           </div>
        </div>
      )}
    </div>
  );
}
