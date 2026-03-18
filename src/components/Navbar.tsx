"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Quote Tool", href: "/quote" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Internal Portal", href: "/internal" },
  ];

  return (
    <nav className="fixed top-0 w-full h-[70px] bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 z-50">
      <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tighter hover:opacity-80 transition-opacity">
        <Cpu className="text-sky-400 w-8 h-8" />
        <span>HEIGHT <span className="text-sky-400">AUTOMATION</span></span>
      </Link>
      
      <div className="flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-sky-400 ${
              pathname === link.href ? "text-sky-400" : "text-slate-400"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
