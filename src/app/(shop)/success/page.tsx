"use client";
import { useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { 
  CheckCircle2, ShoppingBag, ArrowRight, 
  Printer, Share2, Package, Mail, Calendar,
  Loader2 
} from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-772109";
  const { fetchCart } = useCartStore();
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    // Clear global cart state after order success by passing null/undefined context
    fetchCart(undefined, undefined);
  }, [fetchCart]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-12 md:py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
          <div className="mb-6 inline-flex relative">
            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative bg-white p-4 rounded-full shadow-xl shadow-green-500/10">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 italic">
            Thank You for Your Purchase!
          </h1>
          <p className="text-slate-500 text-lg">
            Your order has been received and is now being processed.
          </p>
        </div>

        {/* Premium Receipt Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden mb-10">
          <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Order Number</p>
              <h2 className="text-xl font-mono font-bold">#{orderId}</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrint} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Steps / Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Confirmation</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Sent to your email</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Est. Delivery</h4>
                  <p className="text-[10px] text-slate-500 mt-1">3-5 Business Days</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Status</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Order Processing</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
               <div className="flex justify-between items-center text-sm mb-6">
                  <span className="text-slate-400 font-medium">Order Date:</span>
                  <span className="text-slate-900 font-bold">{today}</span>
               </div>
               
               <div className="bg-slate-50 rounded-2xl p-6 flex items-start gap-4 mb-8">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 mb-1">What happens next?</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      We'll send you a tracking number as soon as your package ships. You can also view your order history in your account dashboard.
                    </p>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href={`/track/${orderId}`} className="group w-full py-4 bg-slate-900 hover:bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                Track My Order <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/products" className="w-full py-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                <ShoppingBag className="w-4 h-4" /> Browse More
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Support */}
        <p className="text-center text-slate-400 text-xs">
          Need help? <Link href="/support" className="text-primary font-bold hover:underline">Contact Support</Link> or call 1800-PREMIUM
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}