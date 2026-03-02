"use client";
import { useEffect, useState, use } from "react";
import { orderService } from "@/services/order.service";
import { OrderTrackResponse } from "@/types/order";
import { 
  Package, Truck, CheckCircle2, MapPin, 
  Clock, Loader2, ChevronLeft, Calendar,
  Box, ShieldCheck, HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function TrackOrderPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = use(params);
  const [data, setData] = useState<OrderTrackResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getTrackOrder(orderNo).then(res => {
      if (res.status === 1) setData(res.data);
      setLoading(false);
    });
  }, [orderNo]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
        <p className="text-slate-500 font-medium animate-pulse">Locating your package...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <HelpCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't find an order with number #{orderNo}.</p>
        <Link href="/products" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const { master, items, shippingAddress } = data;
  const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(master.oM_OrderStatus.toUpperCase());

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/account/orders" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" /> My Orders
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified Order</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        {/* Main Tracking Card */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Official Tracking
                </span>
                <span className="text-slate-300 text-sm">|</span>
                <span className="text-slate-500 text-sm font-medium">Placed on {new Date(master.oM_CreatedOn).toLocaleDateString()}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">Order #{master.oM_OrderNo}</h1>
            </div>
            
            <div className="flex flex-col items-end">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current Status</p>
                  <span className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest inline-block shadow-lg shadow-slate-900/20">
                    {master.oM_OrderStatus}
                  </span>
               </div>
            </div>
          </div>

          {/* Visual Stepper */}
          <div className="relative">
            {/* Progress Line Background */}
            <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 hidden md:block" />
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-5 left-0 h-1 bg-primary transition-all duration-1000 hidden md:block" 
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />

            <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;

                return (
                  <div key={step} className="flex flex-row md:flex-col items-center gap-4 md:gap-0 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500
                      ${isActive ? 'bg-primary text-white scale-125' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                       step === 'PENDING' ? <Clock className="w-4 h-4" /> :
                       step === 'PROCESSING' ? <Box className="w-4 h-4" /> :
                       step === 'SHIPPED' ? <Truck className="w-4 h-4" /> :
                       <Package className="w-4 h-4" />}
                    </div>
                    <div className="md:text-center">
                      <p className={`text-[10px] font-black mt-3 uppercase tracking-widest ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                        {step}
                      </p>
                      {isActive && <p className="text-[9px] text-slate-400 font-medium hidden md:block">Active Now</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Items Detail */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-slate-900">Package Contents</h3>
                <span className="text-xs text-slate-400 font-bold">{items.length} Items</span>
              </div>
              <div className="p-8 space-y-6">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className="w-20 h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                       <img 
                        src={item.oI_ImagesUrl?.startsWith("http") ? item.oI_ImagesUrl : `https://localhost:7201${item.oI_ImagesUrl}`} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{item.oI_ProductName}</h4>
                      <p className="text-xs text-slate-400 font-medium">Qty: {item.oI_Qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-slate-900 tracking-tight">₹{item.oI_TotalAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-50 p-8 border-t border-slate-100">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-bold">₹{master.oM_SubTotal}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Tax & Duties</span>
                    <span className="text-slate-900 font-bold">₹{master.oM_TaxAmount || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-emerald-600">
                    <span>Standard Shipping</span>
                    <span className="font-black uppercase tracking-widest text-[10px]">Free</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Grand Total</span>
                    <span className="text-2xl font-serif font-bold text-primary">₹{master.oM_GrandTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Delivery Card */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-white/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                Delivery Address
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recipient</p>
                  <p className="font-bold text-lg">{shippingAddress.oA_FullName}</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                    {shippingAddress.oA_AddressLine1},<br />
                    {shippingAddress.oA_City}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Expected by Next Week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Need help with this order?</h4>
              <p className="text-xs text-slate-400 mb-4">Our premium support team is available 24/7 to assist you.</p>
              <button className="w-full py-3 border border-slate-900 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                Contact Concierge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}