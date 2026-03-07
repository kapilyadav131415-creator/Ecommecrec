import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Link href="/" className="text-3xl  font-extrabold tracking-widest text-white">
              MY<span className="text-amber-400">SHOP</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Defining modern luxury through curated craftsmanship and sustainable practices.
            </p>
            <div className="flex gap-5">
              <Instagram className="h-5 w-5 hover:text-amber-400 transition-transform hover:-translate-y-1" />
              <Facebook className="h-5 w-5 hover:text-amber-400 transition-transform hover:-translate-y-1" />
              <Twitter className="h-5 w-5 hover:text-amber-400 transition-transform hover:-translate-y-1" />
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">Departments</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/electronics" className="hover:text-amberv transition-colors">Electronics</Link></li>
              <li><Link href="/fashion" className="hover:text-amber-400 transition-colors">Men & Women</Link></li>
              <li><Link href="/home" className="hover:text-amberv transition-colors">Home Decor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/track" className="hover:text-amber-400 transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-amber-400 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-amber-400 transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">Contact</h4>
            <div className="space-y-5 text-sm">
              <div className="flex gap-4 items-start font-medium leading-tight">
                <MapPin className="h-5 w-5 text-amber-400 shrink-0" />
                <span>7th Avenue, Luxury District <br /> New York, NY</span>
              </div>
              <div className="flex gap-4 items-center font-medium">
                <Phone className="h-5 w-5 text-amber-400" />
                <span>+1 800-MY-SHOP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-black py-8 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <span>© 2026 MyShop Retailers Ltd.</span>
          <div className="flex gap-10">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}