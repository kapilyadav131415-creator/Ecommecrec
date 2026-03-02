"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Eye, Star, Heart, CheckCircle2, X } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onQuickAdd?: () => void;
}

export default function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const [showToast, setShowToast] = useState(false);

  const defaultImage = product.images.find(img => img.isdefault)?.imagE_URL 
    || product.images[0]?.imagE_URL 
    || "/placeholder.png";

  const hasVariants = product.variants && product.variants.length > 0;
  const originalPrice = hasVariants ? product.variants[0].price : 0;
  const sellingPrice = hasVariants ? product.variants[0].actualPrice : 0;
  
  const discountPercent = originalPrice > sellingPrice 
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) 
    : 0;

  const formatINR = (amount: number) => 
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'INR', // Switched to GBP to match your reference image
      maximumFractionDigits: 2
    }).format(amount);

  return (
    <div className="group flex flex-col bg-white transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden border border-slate-100 rounded-sm mb-4">
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 uppercase">
            Save {discountPercent}%
          </div>
        )}

        <img
          src={defaultImage.startsWith('http') ? defaultImage : `https://localhost:7201${defaultImage}`}
          alt={product.pD_NAME}
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Desktop Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-2">
          <Link href={`/products/${product.pD_ID}`} className="p-3 bg-white rounded-full text-primary hover:bg-primary hover:text-white transition-all shadow-lg">
            <Eye className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => { if(onQuickAdd) onQuickAdd(); }}
            className="p-3 bg-orange-500 text-white rounded-full hover:bg-primary transition-all shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-xl font-bold text-primary">
            {formatINR(sellingPrice)}
          </span>
          {originalPrice > sellingPrice && (
            <span className="text-sm text-slate-400 line-through ml-2">
              {formatINR(originalPrice)}
            </span>
          )}
        </div>

        <Link href={`/products/${product.pD_ID}`}>
          <h3 className="text-sm md:text-base font-medium text-slate-800 line-clamp-2 hover:text-primary transition-colors mb-2 min-h-[40px]">
            {product.pD_NAME}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-3 h-3 ${i <= 4 ? "fill-orange-400 text-orange-400" : "text-slate-200"}`} />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-tighter">10 reviews</span>
          </div>

          {/* Mobile Add to Bag Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (onQuickAdd) onQuickAdd(); 
            }}
            className="w-full md:hidden bg-black text-white text-[10px] font-bold uppercase py-3 rounded-sm flex items-center justify-center gap-2 active:bg-orange-600"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}