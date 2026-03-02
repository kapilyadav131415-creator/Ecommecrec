"use client";
import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        {/* Inner static logo or icon */}
        <div className="absolute flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent animate-pulse">
            My<span className="text-primary">Shop</span>
          </span>
        </div>
      </div>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        Refining your collection...
      </p>
    </div>
  );
}