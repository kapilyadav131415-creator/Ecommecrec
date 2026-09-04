"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { Trash2, Plus, Minus, Loader2, ShoppingBag, LayoutGrid, List, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cartService } from '@/services/cart.service';
import { authService } from "@/services/auth.service";
import { getSessionId } from "@/utils/session";

export default function CartPage() {
  const { cart, fetchCart } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);
  // View state: 'list' or 'grid'
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');
  
  const user = authService.getCurrentUser();
  const sessionId = getSessionId();

  useEffect(() => {
    const syncCart = async () => {
      await fetchCart(user?.id, sessionId);
    };
    syncCart();
  }, [user?.id, sessionId, fetchCart]);

  const updateQty = async (item: any, newQty: number) => {
    setIsUpdating(true);
    try {
      await cartService.updateItem({
        userId: user?.id || null,
        sessionId: sessionId,
        productId: item.cI_ProductId,
        variantId: item.cI_VariantId,
        qty: newQty
      });
      await fetchCart(user?.id, sessionId);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (cart === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-16 w-16 text-slate-300" />
        <h2 className="text-2xl font-serif font-bold text-primary">Your bag is empty</h2>
        <Link href="/products" className="mt-4 px-8 py-3 bg-primary text-white rounded-xl font-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
      {/* Header & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Shopping Bag ({cart.cM_TotalQty})</h1>
        </div>

        {/* VIEW AS TOGGLE (Inspired by your image) */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 w-fit">
          <span className="text-sm font-bold text-slate-600 ml-2">View as</span>
          <div className="flex gap-1">
            <button 
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-orange-100 text-orange-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ITEMS SECTION */}
        <div className={`lg:col-span-8 ${viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-4'}`}>
          {cart.cartItems.map((item, idx) => (
            <div 
              key={`${item.cI_ProductId}-${idx}`} 
              className={`bg-white border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg
                ${viewType === 'grid' 
                  ? 'rounded-[2rem] flex flex-col p-5' 
                  : 'rounded-3xl flex flex-row p-6 items-center gap-6'
                }`}
            >
              {/* IMAGE CONTAINER */}
              <div className={`relative bg-slate-100 rounded-2xl overflow-hidden shrink-0 
                ${viewType === 'grid' ? 'w-full h-52 mb-4' : 'w-24 h-32 md:w-32 md:h-40'}`}
              >
                <img
                  src={item.cI_ImageUrl?.startsWith("http") ? item.cI_ImageUrl : `https://localhost:7201${item.cI_ImageUrl}`}
                  className="w-full h-full object-cover"
                  alt={item.cI_ProductName}
                />
                {item.cI_ActualPrice > item.cI_UnitPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">SALE</span>
                )}
              </div>

              {/* CONTENT CONTAINER */}
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className={`font-serif font-bold text-slate-900 leading-tight ${viewType === 'grid' ? 'text-lg' : 'text-xl'}`}>
                      {item.cI_ProductName}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-orange-600 mt-1 font-bold">
                      {item.pqT_Value || 'Standard'}
                    </p>
                  </div>
                  <button onClick={() => updateQty(item, 0)} className="text-slate-300 hover:text-red-500 p-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className={`flex items-center justify-between mt-auto pt-4 ${viewType === 'grid' ? 'flex-row' : 'flex-row'}`}>
                  {/* QTY BOX */}
                  <div className="flex items-center bg-slate-100 rounded-full px-2 h-9 border border-slate-200">
                    <button
                      disabled={isUpdating || item.cI_Qty <= 1}
                      onClick={() => updateQty(item, item.cI_Qty - 1)}
                      className="p-1 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold text-sm min-w-[2rem] text-center">{item.cI_Qty}</span>
                    <button
                      disabled={isUpdating}
                      onClick={() => updateQty(item, item.cI_Qty + 1)}
                      className="p-1 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* PRICE BOX */}
                  <div className="text-right">
                    {item.cI_ActualPrice > item.cI_UnitPrice && (
                      <p className="text-[10px] text-slate-400 line-through">${item.cI_ActualPrice * item.cI_Qty}</p>
                    )}
                    <p className="text-lg font-bold font-serif text-slate-900">${item.cI_TotalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY SECTION */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] sticky top-28 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm opacity-90">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.cM_SubTotalAmt}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${cart.cM_TaxAmt || 0}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>-${cart.cM_DiscountAmt || 0}</span>
              </div>
              <div className="border-t border-white/10 pt-6 flex justify-between font-bold text-2xl font-serif">
                <span>Total</span>
                <span>${cart.cM_GrandTotal}</span>
              </div>
            </div>

            <Link href="/checkout" className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-orange-50 transition-colors">
              Secure Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-tighter text-white/50">
              <ShieldCheck className="w-4 h-4" />
              100% Secure SSL Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}