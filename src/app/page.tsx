import Navbar from "@/components/Navbar";
import { ArrowRight, Bot, Shield, Eye } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-[70px]">
        {/* Hero Section */}
        <section className="relative py-20 px-8 flex flex-col items-center text-center overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-display">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                Automated Precision
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Height Automation delivers elite robotic integration, custom vision systems, 
              and advanced safety engineering for the next generation of manufacturing.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <Link href="/quote" className="btn-primary group">
                Configure Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/services" className="px-6 py-3 rounded-lg font-semibold text-white border border-white/10 hover:bg-white/5 transition-all">
                Explore Capabilities
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Projects Highlight */}
        <section className="py-20 px-8 max-w-7xl mx-auto space-y-12">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                 <h2 className="text-4xl font-black font-display tracking-tight uppercase">Featured <span className="text-sky-400">Projects</span></h2>
                 <p className="text-slate-500 max-w-sm">A glimpse into our recent industrial robot integrations and custom automation cells.</p>
              </div>
              <Link href="/gallery" className="text-sky-400 font-bold flex items-center gap-2 group">
                 View Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative glass aspect-video overflow-hidden cursor-pointer">
                 <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                    <Bot className="w-16 h-16 text-slate-800" />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                 <div className="absolute bottom-6 left-6 space-y-1 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-bold">Automotive Weld Cell</h3>
                    <p className="text-slate-400 text-sm">Precision robot welding for Tier 1 suppliers.</p>
                 </div>
              </div>
              <div className="group relative glass aspect-video overflow-hidden cursor-pointer">
                 <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-slate-800" />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                 <div className="absolute bottom-6 left-6 space-y-1 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-bold">Safe-Zone Integration</h3>
                    <p className="text-slate-400 text-sm">Industrial safety scanner & light-curtain deployment.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Blog Teaser */}
        <section className="py-20 px-8 bg-sky-500/5">
           <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
              <div className="space-y-2">
                 <h2 className="text-4xl font-black font-display tracking-tight uppercase">Engineering <span className="text-sky-400">Intelligence</span></h2>
                 <p className="text-slate-400 max-w-xl">Insights from our field engineers on the latest in robotic safety, vision systems, and industrial AI.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                 {[
                   { date: 'MAR 15, 2026', title: 'The Future of Collaborative Robots', category: 'ROBOTICS' },
                   { date: 'MAR 10, 2026', title: 'Why Safety Scanners are Replacing Fencing', category: 'SAFETY' },
                   { date: 'MAR 05, 2026', title: 'Keyence vs Cognex: The 2026 Vision Guide', category: 'VISION' }
                 ].map((post, i) => (
                   <div key={i} className="text-left space-y-3 p-4 hover:bg-white/5 transition-colors rounded-xl group cursor-pointer">
                      <div className="text-[10px] font-black tracking-widest text-sky-500 uppercase">{post.category} — {post.date}</div>
                      <h3 className="text-lg font-bold group-hover:text-sky-400 transition-colors">{post.title}</h3>
                      <button className="text-slate-500 text-sm font-bold flex items-center gap-1">
                        Read Operation Log <ArrowRight className="w-3 h-3" />
                      </button>
                   </div>
                 ))}
              </div>
              <Link href="/blog" className="btn-primary">View All Insights</Link>
           </div>
        </section>
      </main>
    </div>
  );
}
