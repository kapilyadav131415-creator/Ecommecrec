"use client";
import { useEffect, useState } from "react";
import { orderService } from "@/services/order.service";
import { authService } from "@/services/auth.service";
import { getSessionId } from "@/utils/session";
import { 
  Package, ChevronRight, Loader2, ShoppingBag, 
  Search, Filter, Calendar, CreditCard, 
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = authService.getCurrentUser();
  const sessionId = getSessionId();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders(user?.id || 0, sessionId);
        if (res.status === 1) setOrders(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id, sessionId]);

  // Status Badge Helper
  const getStatusStyle = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "DELIVERED") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === "SHIPPED") return "bg-blue-50 text-blue-600 border-blue-100";
    if (s === "PROCESSING") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50/50">
        <Loader2 className="animate-spin text-primary h-12 w-12" />
        <p className="text-slate-500 font-medium">Retrieving your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
          <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary mb-6 transition-colors font-bold text-xs uppercase tracking-widest">
             <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 mb-3">Order Management</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Order History</h1>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Find an order..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10" />
               </div>
               <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50">
                  <Filter className="w-5 h-5 text-slate-600" />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {orders.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">No Curations Found</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">It looks like you haven't placed any orders yet. Start exploring our collection!</p>
            <Link href="/products" className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:shadow-xl transition-all active:scale-95 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.oM_OrderId} className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                {/* Order Top Bar */}
                <div className="px-8 py-5 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/30">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-slate-400" />
                       <span className="text-xs font-bold text-slate-600">
                         {new Date(order.oM_OrderDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                       </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <CreditCard className="w-4 h-4 text-slate-400" />
                       <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{order.oM_PaymentStatus || 'Paid'}</span>
                    </div>
                  </div>
                  <Link href={`/track/${order.oM_OrderNo}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    Manage Order
                  </Link>
                </div>

                {/* Order Content */}
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex gap-6 items-center flex-1">
                      <div className="w-20 h-24 bg-slate-100 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <Package className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="space-y-2">
                        <div className={`px-4 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${getStatusStyle(order.oM_OrderStatus)}`}>
                          {order.oM_OrderStatus}
                        </div>
                        <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-primary transition-colors">#{order.oM_OrderNo}</h3>
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                           <span className="text-slate-900">{order.productname || 'Premium Selection'}</span> 
                           {order.totqty > 1 && <span>& {order.totqty - 1} other items</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full lg:w-auto lg:justify-end gap-12 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-3xl font-serif font-bold text-slate-900">₹{order.oM_GrandTotal}</p>
                      </div>
                      <Link 
                        href={`/track/${order.oM_OrderNo}`} 
                        className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-90"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center mt-8">
         <p className="text-xs text-slate-400">Showing last 24 months of order history. Need help? <Link href="/support" className="text-primary font-bold">Contact Concierge</Link></p>
      </div>
    </div>
  );
}