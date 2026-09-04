"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { authService } from "@/services/auth.service";
import { getSessionId } from "@/utils/session";
import api from "@/services/api";
import { 
  ShieldCheck, MapPin, Loader2, Info, 
  ChevronLeft, CreditCard, Truck, CheckCircle2,
  Lock, ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, fetchCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const router = useRouter();
  
  const user = authService.getCurrentUser();
  const sessionId = getSessionId();

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  useEffect(() => {
    fetchCart(user?.id, sessionId);
    if (user) {
       setFormData(prev => ({ ...prev, fullName: user.name, mobileNo: user.mobileNo || "" }));
    }
  }, [user?.id, sessionId, fetchCart]);

  const fetchLocation = () => {
    setGeoLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.address;

          setFormData(prev => ({
            ...prev,
            addressLine1: data.display_name.split(',').slice(0, 2).join(','),
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
            pincode: addr.postcode || "",
            country: addr.country || "India"
          }));
        } catch (err) {
          console.error("Location fetch failed", err);
        } finally {
          setGeoLoading(false);
        }
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;
    setLoading(true);
    
    try {
      const orderPayload = {
        userId: user?.id || 0,
        sessionId: sessionId,
        cartId: cart.cartId,
        ...formData
      };

      const res = await api.post("/Order/PlaceOrder", orderPayload);
      
      if (res.data.status === 1) {
        router.push(`/success?orderId=${res.data.orderId || 'SUCCESS'}`);
      } else {
        alert(res.data.msg || "Order placement failed");
      }
    } catch (err) {
      console.error("PlaceOrder Error", err);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="bg-slate-50 p-8 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-2 text-slate-900">Your bag is empty</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Looks like you haven't decided on anything yet.</p>
        <Link href="/products" className="bg-primary text-white px-10 py-4 rounded-full font-bold transition-transform active:scale-95 shadow-lg">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Top Progress Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium">
                <ChevronLeft className="w-5 h-5" /> 
                <span className="hidden md:inline">Back to Bag</span>
            </Link>
            
            <div className="flex items-center gap-4 md:gap-10">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-900">Bag</span>
                </div>
                <div className="w-8 h-px bg-slate-200" />
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">2</div>
                    <span className="text-sm font-bold text-slate-900">Shipping</span>
                </div>
                <div className="w-8 h-px bg-slate-200" />
                <div className="flex items-center gap-2 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-[10px] font-bold">3</div>
                    <span className="text-sm font-bold text-slate-500">Payment</span>
                </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-emerald-600">
                <Lock className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</span>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Address Section */}
            <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Delivery Information</h2>
                </div>
                <button 
                  type="button"
                  onClick={fetchLocation}
                  className="group flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-wider bg-white border border-slate-200 px-4 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  {geoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3 transition-transform group-hover:scale-110" />}
                  Auto-Detect
                </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="md:col-span-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1 transition-colors group-focus-within:text-primary">Full Name</label>
                  <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all text-sm font-medium" placeholder="Recipient's Name" />
                </div>

                <div className="group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">+91</span>
                    <input type="tel" required value={formData.mobileNo} onChange={e => setFormData({...formData, mobileNo: e.target.value})} className="w-full h-14 pl-16 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all text-sm font-medium" />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Pincode</label>
                  <input type="text" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all text-sm font-medium" placeholder="6-digit code" />
                </div>

                <div className="md:col-span-2 space-y-4">
                    <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Flat / House No / Building</label>
                        <input type="text" required value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all text-sm font-medium" />
                    </div>
                    <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Street Address / Landmark</label>
                        <input type="text" required value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all text-sm font-medium" />
                    </div>
                </div>

                <div className="group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">City</label>
                  <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all text-sm font-medium" />
                </div>

                <div className="group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">State</label>
                  <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all text-sm font-medium" />
                </div>
              </div>
            </section>

            {/* Payment Mode Selector Mockup */}
            <section className="bg-white rounded-[2rem] border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <CreditCard className="w-5 h-5 text-slate-600" />
                    </div>
                    <h2 className="text-lg font-serif font-bold text-slate-900">Payment Method</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-4 border-primary bg-white" />
                            <span className="font-bold text-sm">Cash on Delivery</span>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="p-5 border-2 border-slate-100 rounded-2xl flex items-center gap-3 cursor-not-allowed opacity-50 grayscale">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                        <span className="font-bold text-sm">Online Payment (Coming Soon)</span>
                    </div>
                </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-32 overflow-hidden">
              {/* Abstract decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-6 relative">Order Preview</h3>
              
              {/* Mini Item List */}
              <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2 scrollbar-hide relative">
                {cart.cartItems.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl">
                        <img src={item.cI_ImageUrl?.startsWith("http") ? item.cI_ImageUrl : `https://localhost:7201${item.cI_ImageUrl}`} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                        <div className="flex-1">
                            <p className="text-[11px] font-bold text-slate-900 line-clamp-1">{item.cI_ProductName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Qty: {item.cI_Qty}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-900">${item.cI_TotalAmount}</span>
                    </div>
                ))}
              </div>
              
              <div className="space-y-4 mb-8 relative">
                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Bag Total</span>
                  <span className="text-slate-900">${cart.cM_SubTotalAmt}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Gst & Taxes</span>
                  <span className="text-slate-900">${cart.cM_TaxAmt || 0}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Standard Shipping</span>
                  <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">Free</span>
                </div>
                {cart.cM_DiscountAmt > 0 && (
                  <div className="flex justify-between text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100">
                    <span className="flex items-center gap-2">Promo Applied</span>
                    <span>- ${cart.cM_DiscountAmt}</span>
                  </div>
                )}
                
                <div className="pt-6 mt-6 border-t border-slate-100">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-500">Grand Total</span>
                        <span className="text-3xl font-serif font-bold text-primary tracking-tight">${cart.cM_GrandTotal}</span>
                    </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 hover:bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-slate-900/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <><ShieldCheck className="w-5 h-5" /> Place Order Now</>
                )}
              </button>

              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Verified Secure Payment
                </div>
                <div className="flex gap-4 grayscale opacity-40">
                    <div className="h-4 w-8 bg-slate-300 rounded" />
                    <div className="h-4 w-8 bg-slate-300 rounded" />
                    <div className="h-4 w-8 bg-slate-300 rounded" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}