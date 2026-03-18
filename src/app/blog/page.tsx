"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { db } from "@/lib/database";
import { BlogPost } from "@/lib/mockDb";
import { ArrowRight, BookOpen, Newspaper, Lightbulb } from "lucide-react";

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
      await db.subscribe(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'ROBOTICS': return <BookOpen className="w-6 h-6 text-sky-400" />;
      case 'VISION': return <Lightbulb className="w-6 h-6 text-sky-400" />;
      case 'SAFETY': return <Newspaper className="w-6 h-6 text-emerald-400" />;
      default: return <BookOpen className="w-6 h-6 text-sky-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-[100px] max-w-5xl mx-auto px-8 pb-20 space-y-12">
        <header className="space-y-4 text-center">
           <div className="mx-auto w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center border border-sky-500/20 mb-6">
              <BookOpen className="text-sky-400 w-6 h-6" />
           </div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase text-white">Engineering <span className="text-sky-400">Intelligence</span></h1>
           <p className="text-slate-500 max-w-2xl mx-auto text-lg italic tracking-tight">"Documenting the evolution of industrial precision."</p>
        </header>

        <div className="space-y-8 pt-12">
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-700">
                <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest">Accessing Knowledge Base...</p>
             </div>
          ) : posts.map((post) => (
            <div key={post.id} className="glass p-8 flex flex-col md:flex-row gap-8 hover:border-sky-500/40 transition-all group cursor-pointer">
              <div className="w-16 h-16 shrink-0 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                {getIcon(post.category)}
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-sky-500 tracking-widest uppercase">{post.category}</span>
                   <span className="text-xs text-slate-500 font-mono italic">{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-2xl font-bold font-display group-hover:text-sky-400 transition-colors uppercase tracking-tight text-white">{post.title}</h2>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
                </p>
                <div className="pt-4 flex items-center gap-2 text-sky-400 font-bold text-sm">
                  View Full Project Breakdown <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
          
          {!loading && posts.length === 0 && (
             <div className="py-20 text-center space-y-4 opacity-30">
                <BookOpen className="w-16 h-16 mx-auto text-slate-700" />
                <p className="font-display text-xl font-black uppercase text-white">Archives Offline: No Posts Found</p>
             </div>
          )}
        </div>

        {/* Newsletter Call to Action */}
        <section className="mt-20 glass p-12 bg-sky-500/10 border-sky-500/20 text-center space-y-6">
           <h2 className="text-3xl font-black font-display uppercase tracking-tight text-white">Stay Automated</h2>
           <p className="text-slate-400 max-w-md mx-auto">Get notified immediately when we publish new project case studies or technical deep-dives.</p>
           <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4 text-left">
              <div className="relative flex-1">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-white shadow-xl"
                />
                {subscribed && (
                  <div className="absolute -bottom-6 left-0 text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                    TRANSMISSION LINK ESTABLISHED
                  </div>
                )}
              </div>
              <button 
                onClick={handleSubscribe}
                className="btn-primary whitespace-nowrap px-8"
              >
                Join the List
              </button>
           </div>
        </section>
      </main>
    </div>
  );
}
