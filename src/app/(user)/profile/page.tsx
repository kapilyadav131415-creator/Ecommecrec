"use client";
import { authService } from "@/services/auth.service";
import { 
  User, Package, MapPin, LogOut, ChevronRight, 
  Settings, Heart, ShieldCheck, Bell, CreditCard 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const user = authService.getCurrentUser();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const menuItems = [
    { label: "Order History", desc: "Track, return, or buy items again", icon: Package, href: "/orders", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "My Addresses", desc: "Edit addresses for orders and gifts", icon: MapPin, href: "/address", color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Payment Methods", desc: "Manage your saved cards and UPIs", icon: CreditCard, href: "/payments", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Wishlist", desc: "Items you've saved for later", icon: Heart, href: "/wishlist", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Account Settings", desc: "Update your password and profile", icon: Settings, href: "/settings", color: "text-slate-600", bg: "bg-slate-100" },
    { label: "Privacy & Security", desc: "Manage data and linked accounts", icon: ShieldCheck, href: "/security", color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900 rounded-full flex items-center justify-center text-white text-4xl md:text-5xl font-serif shadow-2xl relative z-10">
                {user?.name?.charAt(0)}
              </div>
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                  {user?.name || "Guest User"}
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0">
                  Gold Member
                </span>
              </div>
              <p className="text-slate-500 font-medium">{user?.emailId || "user@example.com"}</p>
            </div>

            <div className="md:ml-auto flex gap-3">
               <button className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors relative">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8">
        {/* Quick Stats / Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           {[
             { label: "Active Orders", value: "02" },
             { label: "Wishlist Items", value: "14" },
             { label: "Coupons", value: "03" },
             { label: "Store Credit", value: "₹500" },
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-serif font-bold text-slate-900">{stat.value}</p>
             </div>
           ))}
        </div>

        {/* Action Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="group flex flex-col p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{item.label}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-slate-200 pt-10 gap-6">
           <p className="text-xs text-slate-400 font-medium">Joined MODERN LABS in October 2023</p>
           
           <button 
             onClick={handleLogout} 
             className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
           >
             <LogOut className="w-4 h-4" /> Sign Out from Account
           </button>
        </div>
      </div>
    </div>
  );
}