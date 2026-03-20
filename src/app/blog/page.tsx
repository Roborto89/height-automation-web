"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { db } from "@/lib/database";
import { BlogPost } from "@/lib/mockDb";
import { ArrowRight, BookOpen, Newspaper, Lightbulb, Clock, Hexagon, Mail, ShieldCheck } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await db.getBlogPosts();
      setPosts(data);
      setLoading(false);
    };
    loadPosts();
  }, []);

  const handleSubscribe = async () => {
    if (email) {
      setLoading(true);
      await db.subscribe(email);
      try {
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (err) {
        console.error("Email delivery skipped/failed:", err);
      }
      setSubscribed(true);
      setEmail('');
      setLoading(false);
      setTimeout(() => setSubscribed(false), 8000);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'ROBOTICS': return <BookOpen className="w-6 h-6 text-sky-400" />;
      case 'VISION': return <Lightbulb className="w-6 h-6 text-sky-400" />;
      case 'SAFETY': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      default: return <BookOpen className="w-6 h-6 text-sky-400" />;
    }
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'ELITE': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'ADVANCED': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'INTERMEDIATE': return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      default: return 'text-slate-400 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <Navbar />
      
      <main className="pt-[120px] max-w-6xl mx-auto px-6 pb-32">
        {/* Engineering Intelligence Header */}
        <header className="relative py-12 mb-20 text-center border-b border-white/5">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-sky-500/50 blur-sm" />
           <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-sky-500/5 border border-sky-500/10 text-sky-500 text-[10px] font-black uppercase tracking-[0.3em]">
              <Hexagon className="w-3 h-3 animate-spin duration-700" /> Technical Repository v1.0
           </div>
           <h1 className="text-6xl font-black font-display tracking-tighter uppercase leading-none mb-6">
              Engineering <span className="text-sky-400">Intelligence</span>
           </h1>
           <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed italic border-l-2 border-sky-500/20 pl-6">
              "Documenting the protocols and paradigm shifts in industrial precision as we scale toward autonomous manufacturing."
           </p>
        </header>

        <div className="grid grid-cols-1 gap-12 pt-12">
          {loading ? (
             <div className="py-24 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-2 border-sky-500/20 border-t-sky-500 rounded-2xl animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Accessing Archives...</p>
             </div>
          ) : posts.map((post) => (
            <article key={post.id} className="group relative">
               <div className="absolute -inset-4 bg-white/0 group-hover:bg-white/[0.02] rounded-[2rem] transition-all duration-500 -z-10" />
               <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 items-start">
                  
                  {/* Category Hex/Icon */}
                  <div className="hidden md:flex flex-col items-center gap-4 pt-1">
                     <div className="w-20 h-20 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-slate-900 border border-white/10 rotate-45 rounded-2xl group-hover:border-sky-500/30 transition-colors" />
                        <div className="relative">{getIcon(post.category)}</div>
                     </div>
                     <div className="h-12 w-[1px] bg-gradient-to-b from-white/10 to-transparent" />
                  </div>

                  {/* Content Area */}
                  <div className="glass p-8 md:p-10 space-y-6 hover:border-sky-500/30 transition-all duration-500 group-hover:bg-slate-900/40">
                     <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest bg-sky-500/5 px-3 py-1 rounded-md border border-sky-500/10">
                              {post.category}
                           </span>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${getComplexityColor(post.complexity || 'INTERMEDIATE')}`}>
                              {(post.complexity || 'INTERMEDIATE')} LEVEL
                           </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                           <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime || '5 MIN'}</div>
                           <div className="w-1 h-1 rounded-full bg-slate-800" />
                           <div>{new Date(post.publishedAt).toLocaleDateString()}</div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h2 className="text-3xl font-black font-display text-white uppercase tracking-tight group-hover:text-sky-400 transition-colors duration-500 leading-tight">
                           {post.title}
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed font-medium line-clamp-3">
                           {post.content}
                        </p>
                     </div>

                     <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-sky-500">
                              {post.author.charAt(0)}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{post.author}</span>
                        </div>
                        <button className="flex items-center gap-2 text-sky-500 font-black uppercase tracking-[0.2em] text-[10px] group/btn">
                           Deploy Full Brief <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                     </div>
                  </div>
               </div>
            </article>
          ))}
          
          {!loading && posts.length === 0 && (
             <div className="py-24 text-center space-y-4 opacity-10">
                <BookOpen className="w-20 h-20 mx-auto text-slate-700" />
                <p className="font-display text-2xl font-black uppercase text-white tracking-[0.5em]">Archives Offline</p>
             </div>
          )}
        </div>

        {/* Technical Newsletter - High Fidelity Success Flow */}
        <section className="mt-32 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-emerald-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
           <div className="relative glass p-12 md:p-16 bg-slate-950/90 rounded-[2.5rem] border-white/5 text-center overflow-hidden">
              
              {subscribed ? (
                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                   <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-10 h-10 text-emerald-500" />
                   </div>
                   <div className="space-y-2">
                      <h2 className="text-4xl font-black font-display uppercase tracking-tight text-white leading-none">Transmission <span className="text-emerald-500">Established</span></h2>
                      <p className="text-slate-500 text-lg font-medium italic">"Encryption channel secure. Technical briefings scheduled for delivery."</p>
                   </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-10 group-hover:rotate-12 transition-transform duration-500">
                      <Mail className="w-8 h-8 text-sky-400" />
                   </div>
                   <div className="space-y-4 mb-12">
                      <h2 className="text-4xl font-black font-display uppercase tracking-tight text-white">Scale <span className="text-sky-400">Intelligence</span></h2>
                      <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed font-medium">
                         Receive low-latency technical deep-dives and architectural breakthroughs directly from our lead engineering team.
                      </p>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4">
                      <div className="relative flex-1 group/input">
                         <div className="absolute -inset-0.5 bg-sky-500/30 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500"></div>
                         <input 
                           type="email" 
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="engineer@company.com"
                           className="relative w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-sky-500 transition-all font-mono text-sm text-white"
                         />
                      </div>
                      <button 
                         onClick={handleSubscribe}
                         disabled={loading}
                         className="h-[58px] bg-white text-slate-950 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-sky-400 hover:text-white transition-all duration-300 disabled:opacity-30"
                      >
                         Join Network
                      </button>
                   </div>
                </>
              )}
           </div>
        </section>
      </main>
    </div>
  );
}
