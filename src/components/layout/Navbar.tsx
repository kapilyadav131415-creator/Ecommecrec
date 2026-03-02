"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { MenuItem, getFilterUrl } from "@/types/menu";
import { useCartStore } from "@/store/cart.store";
import { getSessionId } from "@/utils/session";
import { 
  ShoppingCart, User, Search, Menu, ChevronDown, 
  Heart, MapPin, Package, X, ChevronRight,
  LogOut, ShoppingBag, UserCircle
} from "lucide-react";

export default function Navbar() {
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const { cart, fetchCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let currentUserId = null;

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        currentUserId = parsedUser.id;
      } catch (e) {
        console.error("User parsing error", e);
      }
    }

    const sessionId = getSessionId();
    fetchCart(currentUserId, sessionId);

    const fetchMenu = async () => {
      try {
        const res = await api.get("/Mainmenu/GetActiveListmenu");
        if (res.data.status === 1) {
          const flatData: MenuItem[] = res.data.data;
          const tree = flatData.filter(item => item.levelNo === 1).map(l1 => ({
            ...l1,
            children: flatData.filter(l2 => 
              l2.levelNo === 2 && l2.parentid === l1.id && l2.mainMenu === l1.mainMenu
            ).map(l2 => ({
              ...l2,
              children: flatData.filter(l3 => 
                l3.levelNo === 3 && l3.parentid === l2.id && l3.mainMenu === l2.mainMenu
              )
            }))
          }));
          setMenuTree(tree);
        }
      } catch (err) {
        console.error("Failed to load navigation data", err);
      }
    };
    fetchMenu();
  }, [fetchCart]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsMobileMenuOpen(false);
    fetchCart(undefined, getSessionId());
    router.push("/login");
  };

  return (
    <header className="w-full sticky top-0 z-[100] bg-white border-b border-slate-100">
      {/* 1. TOP BAR (Simple & Clean) */}
      <div className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs py-2 px-4 md:px-8 hidden md:flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link href="/track-order" className="hover:text-black transition flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Track Order
          </Link>
          <span className="w-px h-3 bg-slate-300" />
          <p className="flex items-center gap-1.5 font-medium">
            <Package className="h-3.5 w-3.5" /> Free Shipping on ₹2500+
          </p>
        </div>
        <Link href="/wishlist" className="hover:text-black transition flex items-center gap-1.5">
          <Heart className="h-3.5 w-3.5" /> Wishlist
        </Link>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="mx-auto flex h-16 lg:h-20 max-w-7xl items-center justify-between px-4 md:px-8 gap-4">
        {/* Mobile Menu Trigger & Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="lg:hidden p-2 -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            MY<span className="text-slate-500">SHOP</span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-1 focus:ring-slate-300 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 md:gap-4">
          {/* User Account Dropdown */}
          <div className="hidden md:block group relative">
            <button className="flex items-center gap-1.5 p-2 text-slate-700 hover:text-black transition">
              <UserCircle className="h-6 w-6" />
              <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="bg-white border border-slate-200 shadow-xl rounded-xl w-48 p-2 overflow-hidden">
                {user ? (
                  <>
                    <div className="px-3 py-2 mb-1 border-b border-slate-50">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Welcome</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                    </div>
                    <Link href="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition">
                      <ShoppingBag className="h-4 w-4" /> My Orders
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition mt-1">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg text-center justify-center hover:bg-slate-800 transition">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 text-slate-700 hover:text-black transition rounded-full hover:bg-slate-100">
            <ShoppingCart className="h-6 w-6" />
            {cart && cart.cM_TotalQty > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-slate-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cart.cM_TotalQty}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION (Simple Labels) */}
      <nav className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-8 h-12 flex items-center justify-center border-t border-slate-50">
          <div className="flex gap-1 h-full">
            {menuTree.map((l1) => (
              <div key={l1.id} className="group h-full relative">
                <Link 
                  href={getFilterUrl(l1)} 
                  className="h-full px-5 flex items-center gap-1 text-[13px] font-medium text-slate-600 hover:text-black transition-colors"
                >
                  {l1.name}
                  {l1.children!.length > 0 && <ChevronDown className="h-3 w-3 opacity-40 group-hover:rotate-180" />}
                </Link>

                {l1.children!.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-2xl p-6 min-w-[400px] grid grid-cols-2 gap-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 rounded-b-xl">
                    {l1.children!.map((l2) => (
                      <div key={l2.id}>
                        <Link href={getFilterUrl(l2)} className="text-sm font-bold text-slate-900 block mb-3 hover:underline">
                          {l2.name}
                        </Link>
                        <ul className="space-y-1.5">
                          {l2.children?.map((l3) => (
                            <li key={l3.id}>
                              <Link href={getFilterUrl(l3)} className="text-xs text-slate-500 hover:text-black transition-colors">
                                {l3.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. REFINED MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-[200] ${isMobileMenuOpen ? "visible" : "invisible"}`}>
        <div 
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className={`absolute top-0 left-0 h-full w-[280px] bg-white transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between p-5 border-b">
            <span className="text-sm font-bold uppercase text-slate-400">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)}><X className="h-5 w-5" /></button>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {/* User Profile on Mobile */}
            <div className="p-5 bg-slate-50 border-b">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-10 w-10 text-slate-400" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-slate-400">Hello,</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-center text-xs font-semibold bg-white border rounded-lg text-slate-700">Orders</Link>
                    <button onClick={handleLogout} className="py-2 text-center text-xs font-semibold bg-red-50 text-red-600 border border-red-100 rounded-lg">Logout</button>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-bold">
                  Sign In / Join
                </Link>
              )}
            </div>

            {/* Navigation Links */}
            <div className="p-2">
              {menuTree.map((l1) => (
                <div key={l1.id} className="mb-1">
                  <button 
                    onClick={() => setActiveMobileSub(activeMobileSub === l1.id ? null : l1.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700"
                  >
                    {l1.name}
                    {l1.children!.length > 0 && <ChevronRight className={`h-4 w-4 transition-transform ${activeMobileSub === l1.id ? "rotate-90" : ""}`} />}
                  </button>

                  <div className={`overflow-hidden transition-all ${activeMobileSub === l1.id ? "max-h-[800px] mb-2" : "max-h-0"}`}>
                    <div className="pl-4 py-2 space-y-4">
                      {l1.children?.map((l2) => (
                        <div key={l2.id}>
                          <p className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">{l2.name}</p>
                          <div className="grid gap-2 pl-3 border-l border-slate-100">
                            {l2.children?.map((l3) => (
                              <Link 
                                key={l3.id} 
                                href={getFilterUrl(l3)} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm text-slate-500 py-1"
                              >
                                {l3.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}