"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Eye, Star, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onQuickAdd?: () => void;
}

export default function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const defaultImage =
    product.images.find((img) => img.isdefault)?.imagE_URL ||
    product.images[0]?.imagE_URL ||
    "/placeholder.png";

  const hasVariants = product.variants?.length > 0;
  const originalPrice = hasVariants ? product.variants[0].price : 0;
  const sellingPrice = hasVariants ? product.variants[0].actualPrice : 0;

  const discountPercent =
    originalPrice > sellingPrice
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur p-1.5 rounded-full shadow-sm"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400"
            }`}
          />
        </button>

        {/* Image */}
        <Link href={`/products/${product.pD_ID}`}>
          <img
            src={
              defaultImage.startsWith("http")
                ? defaultImage
                : `https://localhost:7201${defaultImage}`
            }
            alt={product.pD_NAME}
            className="w-full h-full object-contain p-3 md:p-6 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Hover Buttons */}
        <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition items-center justify-center gap-3">
          <Link
            href={`/products/${product.pD_ID}`}
            className="bg-white p-2 rounded-full hover:bg-black hover:text-white transition"
          >
            <Eye size={16} />
          </Link>

          <button
            onClick={() => onQuickAdd && onQuickAdd()}
            className="bg-orange-500 text-white p-2 rounded-full hover:bg-black transition"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-3 md:p-4 flex flex-col flex-1 items-center">
        
        {/* Title */}
        <Link href={`/products/${product.pD_ID}`}>
          <h3 className="text-sm md:text-base font-medium text-slate-800 line-clamp-2 hover:text-orange-500 transition min-h-[38px] md:min-h-[44px]">
            {product.pD_NAME}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i <= 4
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-200"
              }`}
            />
          ))}
          <span className="text-[10px] text-slate-400 ml-1 hidden sm:block">
            (24)
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm md:text-base font-bold text-slate-900">
            {formatINR(sellingPrice)}
          </span>

          {originalPrice > sellingPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatINR(originalPrice)}
            </span>
          )}
        </div>

        {/* Mobile Add Button */}
        <button
          onClick={() => onQuickAdd && onQuickAdd()}
          className="mt-3 md:hidden w-full bg-black text-white text-xs font-semibold py-2 rounded-lg active:scale-95 transition"
        >
          Add to Cart
        </button>

        {/* Desktop Add Button */}
        <button
          onClick={() => onQuickAdd && onQuickAdd()}
          className="hidden md:block mt-4 w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-orange-500 transition"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}