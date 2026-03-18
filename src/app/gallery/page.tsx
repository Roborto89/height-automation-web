"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { db } from "@/lib/database";
import { MediaItem } from "@/lib/mockDb";
import { Play, Maximize2, Camera, Film } from "lucide-react";

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    const loadMedia = async () => {
      const data = await db.getMedia();
      setMedia(data);
    };
    loadMedia();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-[100px] max-w-7xl mx-auto px-8 pb-20 space-y-12">
        <header className="space-y-4 text-center">
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">Project <span className="text-sky-400">Chronoscope</span></h1>
           <p className="text-slate-500 max-w-2xl mx-auto text-lg italic">A visual record of our industrial precision and automation triumphs.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {media.map((item) => (
            <div key={item.id} className="group relative glass overflow-hidden aspect-[4/5] hover:border-sky-500/50 transition-all duration-500 cursor-pointer">
              {/* Media Content */}
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                 {item.type === 'video' ? (
                   <div className="relative w-full h-full flex items-center justify-center">
                      <Film className="w-12 h-12 text-slate-800" />
                      <div className="absolute inset-0 bg-sky-500/5 group-hover:bg-sky-500/10 transition-colors" />
                      <div className="p-4 bg-sky-500 rounded-full text-slate-950 shadow-xl shadow-sky-500/20 group-hover:scale-110 transition-transform">
                         <Play className="w-6 h-6 fill-current" />
                      </div>
                   </div>
                 ) : (
                   <div className="relative w-full h-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-slate-800" />
                      <div className="absolute inset-0 bg-slate-950/20" />
                   </div>
                 )}
              </div>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 p-8 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-sky-400 mb-2">
                   {item.type === 'video' ? 'Operational Insight' : 'Design Capture'}
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-tight">{item.title}</h3>
                <p className="text-[10px] text-slate-500 font-black tracking-widest">{item.category}</p>
                
                <div className="pt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                   <div className="p-2 bg-white/10 rounded-lg hover:bg-sky-500 hover:text-slate-950 transition-colors">
                      <Maximize2 className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deploy Link: {item.url.slice(0, 20)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {media.length === 0 && (
          <div className="py-40 text-center space-y-4 opacity-30">
             <Camera className="w-16 h-16 mx-auto text-slate-700" />
             <p className="font-display text-xl font-black uppercase">Terminal Empty: No Assets Deployed</p>
          </div>
        )}
      </main>
    </div>
  );
}
