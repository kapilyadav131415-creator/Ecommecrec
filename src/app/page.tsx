"use client";
import Link from "next/link";
import { 
  ShoppingBag, Zap, ShieldCheck, Globe, 
  Star, ChevronRight, Sparkles, MoveRight
} from "lucide-react";

export default function Home() {
const trustItems = [
  { icon: Zap, title: "Expected Delivery", desc: "2–5 Days", color: "text-orange-500" },
  { icon: ShieldCheck, title: "Secure Payments", desc: "SSL Protected", color: "text-emerald-500" },
  { icon: Globe, title: "Premium Sourcing", desc: "200+ Brands", color: "text-indigo-500" },
];
  return (
    <div className="flex flex-col w-full bg-[#f8f9fa]">
      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative w-full h-[80vh] flex items-center bg-[#1a1a1a] overflow-hidden selection:bg-gray-100">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-black/40 z-10" />
           <img 
             src="/images/hero/hero-main.jpg" 
             alt="Curated Interior" 
             className="w-full h-full object-cover" 
           />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full px-6">
          <div className="max-w-xl">
            <Sparkles className="w-8 h-8 text-accent mb-6" />
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1] pointer-events-none selection:bg-gray-600">
              Curated <br /> Home, Living.
            </h1>
            <p className="text-slate-200 text-lg mb-10 font-light leading-relaxed selection:bg-gray-600">
              Discover exquisite designs that define and elevate your everyday environment.
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 selection:bg-accent bg-accent hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl">
              Shop Products <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. BENTO CATEGORY & TRUST GRID */}
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* ================= TRUST FEATURES CARD ================= */}
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-serif font-bold text-primary">
            Shop by Category
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            Curated collections for our customers
          </p>
        </div>

        <Link
          href="/products"
          className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 hover:text-primary transition"
        >
          Shop Products <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Trust Items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {trustItems.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            
            {/* Icon */}
            <div className={`w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center ${item.color} shrink-0`}>
              <item.icon className="w-4 h-4" />
            </div>

            {/* Text */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary leading-tight">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                {item.desc}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>

    {/* ================= REFINED BRAND CARD ================= */}
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">

      {/* Top */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Refined Elegance
          </h2>
          <p className="text-xs text-slate-400 mt-2 pointer-events-none">
            Curated taste for every mood
          </p>
        </div>

        <Link
          href="/products"
          className="text-[11px] text-slate-400 hover:text-primary flex items-center gap-1"
        >
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* CTA */}
      <Link
        href="/products"
        className="mt-10 self-end p-3 rounded-full border border-slate-200 hover:bg-primary hover:text-white transition"
      >
        <MoveRight className="w-4 h-4" />
      </Link>
    </div>

  </div>
</section>


      {/* 3. MARQUEE STRIP */}
      <div className="bg-[black] py-6 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee gap-10">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-10 text-white font-serif italic text-3xl opacity-90">
              <span className="flex items-center gap-4"><Star className="w-6 h-6 text-accent fill-accent" /> Complimentary Shipping</span>
              <span className="flex items-center gap-4"><Star className="w-6 h-6 text-accent fill-accent" /> Authentic Quality</span>
              <span className="flex items-center gap-4"><Star className="w-6 h-6 text-accent fill-accent" /> Sustainably Made</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CURRENT TRENDING SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
           <h2 className="text-3xl font-serif font-bold text-primary italic">Currently Trending</h2>
           <Link href="/products" className="text-xs font-bold text-accent uppercase tracking-widest border-b border-accent">View All Products</Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {['Fashion', 'Grocery', 'Beauty', 'Electronics'].map((cat) => (
             <Link key={cat} href={`/products?mainmenu=${cat}`} className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-200">
                <img src={`/images/categories/${cat.toLowerCase()}.jpg`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                   <h4 className="text-white font-bold uppercase tracking-widest text-sm">{cat}</h4>
                </div>
             </Link>
           ))}
        </div>
      </section>
      
    </div>
  );
}