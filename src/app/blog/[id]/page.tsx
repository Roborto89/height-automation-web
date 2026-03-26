"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { db } from "@/lib/database";
import { BlogPost } from "@/lib/mockDb";
import { ArrowLeft, Clock, Calendar, User, ChevronRight, Zap, Shield, Cpu } from "lucide-react";
import Link from "next/link";

export default function BlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (typeof id === 'string') {
        const data = await db.getBlogPostById(id);
        if (data) {
          setPost(data);
        }
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-2 border-sky-500/20 border-t-sky-500 rounded-2xl animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Decryption in Progress...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Post Not Found</h1>
        <button onClick={() => router.push('/blog')} className="btn-primary">Return to Archives</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-[70px] pb-32">
        {/* Post Hero Section */}
        <header className="relative py-24 px-6 overflow-hidden border-b border-white/5 bg-slate-900/20">
          <div className="absolute inset-0 bg-sky-500/5 blur-[120px] rounded-full -top-1/2 left-1/2 -translate-x-1/2 -z-10" />
          
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-sky-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Protocol Archives
            </Link>

            <div className="flex flex-wrap items-center gap-4">
              <span className="px-3 py-1 rounded bg-sky-500 text-[10px] font-black text-slate-950 uppercase tracking-widest leading-none">
                {post.category}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> {post.readTime || '5 MIN'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-display tracking-tighter uppercase leading-[0.9]">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-sky-500">
                {post.author.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{post.author}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chief Engineering Officer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16 mt-16">
          {/* Post Content */}
          <article className="prose prose-invert prose-sky max-w-none">
            <div className="text-slate-300 text-lg leading-relaxed space-y-8 font-medium whitespace-pre-wrap">
              {post.content}
            </div>
            
            {/* Technical Sign-off */}
            <div className="mt-20 pt-10 border-t border-white/5 space-y-4">
               <div className="flex items-center gap-2 text-sky-500">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">End of Transmission</span>
               </div>
               <p className="text-slate-500 text-xs italic italic">
                 "Every data point captured in this log is verified through our ISO-certified quality assurance cells. 
                 Accuracy is the cornerstone of Height Automation's engineering identity."
               </p>
            </div>
          </article>

          {/* Sidebar Modules */}
          <aside className="space-y-12">
            {/* Related Systems Module */}
            <div className="glass p-8 bg-slate-900/40 border-white/5 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">Linked Systems</h3>
              <div className="space-y-4">
                {[
                  { icon: Cpu, name: 'Robotic Integration', status: 'ACTIVE' },
                  { icon: Shield, name: 'Safety Logic', status: 'VERIFIED' },
                  { icon: Zap, name: 'Scale Intel', status: 'MISSION' }
                ].map((sys, i) => (
                  <div key={sys.name} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-3">
                      <sys.icon className="w-4 h-4 text-sky-500" />
                      <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{sys.name}</span>
                    </div>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 text-slate-600 border border-white/5">{sys.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Module */}
            <div className="glass p-8 bg-sky-500/5 border-sky-500/20 space-y-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-sky-500">Engineering Inquiry</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Interested in deploying these protocols to your warehouse floor? Initiate a technical diagnostic.
               </p>
               <Link href="/quote" className="btn-primary w-full text-center py-3 text-[10px]">
                 Initiate Diagnostic
               </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
