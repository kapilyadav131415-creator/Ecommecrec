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
  <header className="w-full sticky top-0 z-50 bg-black text-white shadow-lg">
    
    {/* TOP STRIP */}
    <div className="hidden md:flex justify-between items-center px-8 py-2 text-xs bg-zinc-900 border-b border-zinc-800">
      <p className="tracking-wider text-amber-400 font-semibold">
        Premium Collection – Free Shipping on ₹2500+
      </p>
      <div className="flex items-center gap-6">
        <Link href="/track-order" className="hover:text-amber-400 transition">
          Track Order
        </Link>
        <Link href="/wishlist" className="hover:text-amber-400 transition">
          Wishlist
        </Link>
      </div>
    </div>

    {/* MAIN NAVBAR */}
    <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
      
      {/* LOGO */}
      <Link href="/" className="text-2xl font-extrabold tracking-widest">
        <span className="text-amber-400">MY</span>SHOP
      </Link>

      {/* DESKTOP MENU */}
      <nav className="hidden lg:flex items-center gap-8 relative">
        {menuTree.map((l1) => (
          <div key={l1.id} className="group relative">
            <Link
              href={getFilterUrl(l1)}
              className="uppercase text-sm tracking-wide hover:text-amber-400 transition"
            >
              {l1.name}
            </Link>

            {/* DROPDOWN */}
            {l1.children!.length > 0 && (
              <div className="absolute left-0 top-full mt-4 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-8 min-w-[500px] grid grid-cols-2 gap-10">

                {l1.children!.map((l2) => (
                  <div key={l2.id}>
                    <Link
                      href={getFilterUrl(l2)}
                      className="block text-amber-400 font-semibold mb-4 hover:underline"
                    >
                      {l2.name}
                    </Link>

                    <ul className="space-y-2">
                      {l2.children?.map((l3) => (
                        <li key={l3.id}>
                          <Link
                            href={getFilterUrl(l3)}
                            className="text-sm text-zinc-300 hover:text-white transition"
                          >
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
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* SEARCH */}
        <div className="hidden lg:block relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-amber-400 transition"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>

        {/* ACCOUNT */}
        <div className="group relative hidden md:block">
          <button className="hover:text-amber-400 transition">
            <User className="h-6 w-6" />
          </button>

          <div className="absolute right-0 top-full mt-3 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition p-4">
            {user ? (
              <>
                <p className="text-xs text-zinc-400 mb-3">
                  Welcome, {user.name}
                </p>
                <Link
                  href="/orders"
                  className="block py-2 text-sm hover:text-amber-400"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-sm text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block bg-amber-400 text-black text-center py-2 rounded-lg font-semibold hover:bg-amber-300 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* CART */}
        <Link href="/cart" className="relative hover:text-amber-400 transition">
          <ShoppingCart className="h-6 w-6" />
          {cart && cart.cM_TotalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">
              {cart.cM_TotalQty}
            </span>
          )}
        </Link>

      </div>
    </div>
  </header>
);
}