"use client";

import Navbar from "@/components/Navbar";
import { db } from "@/lib/database";
import { User } from "@/lib/mockDb";
import { useEffect, useState } from "react";
import { Shield, BadgeCheck, Trophy, Globe, Zap, Cpu, Loader2 } from "lucide-react";

export default function AboutPage() {
  const [personnel, setPersonnel] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPersonnel = async () => {
      try {
        const users = await db.getUsers();
        // Filter for Leadership/Core roles (in this case, all active users for the demo)
        setPersonnel(users.filter(u => u.active));
      } catch (err) {
        console.error("Failed to load personnel:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPersonnel();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-sky-500/30">
      <Navbar />
      
      <main className="pt-24 pb-32">
        {/* Hero Section */}
        <section className="px-6 max-w-7xl mx-auto text-center space-y-8 py-20 relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
           
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-700">
             <Cpu className="w-3 h-3" /> Technical Repository V2.1
           </div>
           
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-display leading-tight uppercase animate-in fade-in slide-in-from-bottom-8 duration-700">
             The Human <span className="text-sky-400">Blueprint</span>
           </h1>
           
           <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-700">
             At Height Automation, our advantage isn't just code—it's decades of collective 
             experience on the world's most complex factory floors. Meet the architects 
             of industrial autonomy.
           </p>
        </section>

        {/* Personnel Registry Grid */}
        <section className="px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-1 md:col-span-2 py-20 flex flex-col items-center justify-center gap-4">
                 <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Personnel Data...</p>
              </div>
            ) : (
              personnel.map((member, i) => (member.role === 'ADMIN' || member.role === 'MANAGER') && (
                <div 
                  key={member.id} 
                  className="glass group relative overflow-hidden bg-slate-900/40 border-white/5 hover:border-sky-500/50 transition-all duration-500 p-8 md:p-12"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                     <BadgeCheck className="w-16 h-16 text-sky-500" />
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-sky-500 transition-colors bg-slate-800">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-700">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-sky-500 text-slate-950 p-2 rounded-xl border-4 border-slate-950">
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h3 className="text-3xl font-black uppercase tracking-tight text-white group-hover:text-sky-400 transition-colors">
                             {member.name}
                           </h3>
                           <BadgeCheck className="w-5 h-5 text-sky-400" />
                        </div>
                        <p className="text-sky-500 font-black text-xs uppercase tracking-[0.2em]">
                          {member.title || "Senior Automation Engineer"}
                        </p>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                        {member.bio || "Leading critical path architectural decisions for complex multi-axis robotic deployments and vision-guided metrology systems."}
                      </p>

                      <div className="flex gap-4 pt-2">
                         <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                           {member.role}
                         </div>
                         <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-500">
                           VERIFIED EXPERT
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Corporate Excellence Section */}
        <section className="pt-32 px-6 max-w-7xl mx-auto">
           <div className="glass p-12 md:p-20 bg-gradient-to-br from-slate-900/50 to-slate-900/10 border-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                 <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                      Scaling <br /><span className="text-sky-400">Veteran Capability</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      Height Automation was founded on the principle that industrial problems 
                      require industrial experience. We don't just provision systems—we 
                      deploy the most rigorous engineering standards in the nation.
                    </p>
                    <div className="flex flex-col gap-6 pt-4">
                       {[
                         { icon: Trophy, title: 'Award Winning Infrastructure', desc: 'Consistently recognized for safety and integration efficiency since 2012.' },
                         { icon: Globe, title: 'National Deployment Framework', desc: 'Proprietary remote support layer with 24/7 on-site emergency capabilities.' }
                       ].map((item, i) => (
                         <div key={i} className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
                               <item.icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                               <h4 className="font-bold text-white uppercase text-sm tracking-tight">{item.title}</h4>
                               <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="glass bg-white/5 border-white/5 p-8 flex flex-col justify-center gap-2">
                       <p className="text-4xl font-black text-sky-400">150+</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Complex Cells Deployed</p>
                    </div>
                    <div className="glass bg-white/5 border-white/5 p-8 flex flex-col justify-center gap-2 mt-8">
                       <p className="text-4xl font-black text-sky-400">24/7</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active System Support</p>
                    </div>
                    <div className="glass bg-white/5 border-white/5 p-8 flex flex-col justify-center gap-2">
                       <p className="text-4xl font-black text-sky-400">100%</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Safety Compliance Record</p>
                    </div>
                    <div className="glass bg-white/5 border-white/5 p-8 flex flex-col justify-center gap-2 mt-8">
                       <p className="text-4xl font-black text-sky-400">98%</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer Retention</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
