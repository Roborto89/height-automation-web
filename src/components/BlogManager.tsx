"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { BlogPost } from '@/lib/mockDb';
import { PenTool, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function BlogManager() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ROBOTICS');
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const loadOverview = async () => {
      const posts = await db.getBlogPosts();
      setRecentPosts(posts.slice(0, 3));
      const subscribers = await db.getSubscribers();
      setSubscriberCount(subscribers.length);
    };
    loadOverview();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    try {
      await db.addBlogPost({
        title,
        content,
        category,
        author: 'Admin'
      });

      setSuccess(true);
      setTitle('');
      setContent('');
      
      const posts = await db.getBlogPosts();
      setRecentPosts(posts.slice(0, 3));
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Publishing failed:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      <header className="space-y-1">
        <h1 className="text-3xl font-black font-display tracking-tight uppercase text-white">Content <span className="text-sky-400">Terminal</span></h1>
        <p className="text-slate-500 text-sm font-medium tracking-wide">Publish project updates and notify the customer base.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
        <div className="glass p-8 bg-slate-900/30 border-white/5">
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Post Title</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Revolutionizing Chassis Weld Cells"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Classification</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold appearance-none"
                >
                  <option value="ROBOTICS">ROBOTICS</option>
                  <option value="VISION">VISION</option>
                  <option value="SAFETY">SAFETY</option>
                  <option value="AI">AI SYSTEMS</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Operation Log Content (Markdown Supported)</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed project breakdown..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all h-64 resize-none font-medium"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isPublishing}
              className="w-full btn-primary h-14 flex items-center justify-center gap-2 group"
            >
              {isPublishing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  PUBLISH & NOTIFY CUSTOMERS
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 bg-sky-500/5 border-sky-500/20 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-sky-400 flex items-center gap-2">
               <AlertCircle className="w-3 h-3" /> Broadcast Info
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Publishing this post will automatically trigger a newsletter broadcast to <span className="text-white font-bold">{subscriberCount} verified customers</span>.
            </p>
          </div>

          {success && (
            <div className="glass p-6 bg-emerald-500/10 border-emerald-500/50 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
               <CheckCircle2 className="text-emerald-500 w-8 h-8 shrink-0" />
               <div>
                  <h4 className="font-bold text-emerald-500 text-sm">Post Sychnonized</h4>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Public link & Newsletter active</p>
               </div>
            </div>
          )}

          <div className="p-6 border border-white/5 rounded-2xl bg-slate-900/50">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Transmission Queue</h3>
             <div className="space-y-3">
                {recentPosts.map(post => (
                  <div key={post.id} className="flex justify-between items-center text-xs p-3 bg-slate-950 rounded-lg border border-white/5">
                     <span className="text-slate-300 font-medium truncate max-w-[150px]">{post.title}</span>
                     <span className="text-[10px] text-slate-500 font-mono italic">SENT</span>
                  </div>
                ))}
                {recentPosts.length === 0 && (
                  <p className="text-[10px] text-slate-600 font-bold uppercase py-4 text-center">No transmissions logged</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
