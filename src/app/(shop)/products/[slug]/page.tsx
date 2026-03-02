"use client";
import { useEffect, useState, use } from "react";
import { productService } from "@/services/product.service";
import { Product, ProductVariant } from "@/types/product";
import { 
  Star, ShoppingBag, Heart, ShieldCheck, 
  Truck, RotateCcw, Loader2, Plus, Minus, Info ,CheckCircle2 ,X
} from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { authService } from "@/services/auth.service"; // New
import { getSessionId } from "@/utils/session"; // New

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
   const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // 1. Fetch Product Data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getProductDetails(slug);
        console.log(data);
        if (data) {
          setProduct(data);
          setActiveImage(data.images.find(img => img.isdefault)?.imagE_URL || data.images[0]?.imagE_URL || "");
          setSelectedVariant(data.variants[0] || null);
        }
      } catch (err) {
        console.error("Product not found", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  // 2. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-8 h-8" />
      </div>
    );
  }

  // 3. Null Check (Crucial: Nothing below this line will throw "possibly null" errors)
  if (!product) {
    return (
      <div className="p-20 text-center font-bold text-slate-500">
        Product not found.
      </div>
    );
  }

  // 4. Helper calculations (Safe because product is guaranteed here)
  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    const user = authService.getCurrentUser();
    
    // Execute Flag 1 in your Stored Procedure
    await addItem({
      userId: user ? user.id : null, // ID from token/user storage
      sessionId: getSessionId(),     // UUID from storage
      productId: product.pD_ID,
      variantId: selectedVariant.pV_Id,
      qty: quantity
    });
    
    setToastMsg(`${product.pD_NAME} added to your bag.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const discount = selectedVariant 
    ? Math.round(((selectedVariant.price - selectedVariant.actualPrice) / selectedVariant.price) * 100) 
    : 0;
    
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : true;
 
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 animate-fade-in">
         {showToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in fade-in slide-in-from-right-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div className="flex-1 text-xs font-bold text-primary">{toastMsg}</div>
            <X className="h-4 w-4 text-slate-300 cursor-pointer" onClick={() => setShowToast(false)} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="lg:col-span-5 space-y-4">
          <div className=" aspect-square sm:aspect-[4/5]
    bg-slate-50 rounded-2xl
    overflow-hidden border border-slate-100
    shadow-sm relative">
            <img 
              src={activeImage.startsWith('http') ? activeImage : `https://localhost:7201${activeImage}`} 
              className="w-full h-full object-cover transition-opacity duration-300" 
              alt={product.pD_NAME} 
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img.imagE_URL)}
                className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 
                  ${activeImage === img.imagE_URL ? 'border-accent opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img 
                  src={img.imagE_URL.startsWith('http') ? img.imagE_URL : `https://localhost:7201${img.imagE_URL}`} 
                  className="w-full h-full object-cover" 
                  alt={`${product.pD_NAME} view ${idx}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="lg:col-span-7 flex flex-col pt-1">
          <div className="mb-6 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-amber-50 px-2 py-0.5 rounded">
                {product.typeName || "Exclusive"}
              </span>
              <span className="text-slate-400 text-[10px] font-medium tracking-widest uppercase">
                ID: {product.product_Code}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-2 leading-snugt uppercase">
              {product.pD_NAME}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(4)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                <Star className="w-3.5 h-3.5 text-slate-200" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter">
                4.2 • 128 Reviews
              </span>
            </div>
          </div>

          {/* PRICING & STOCK */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-primary">₹{selectedVariant?.actualPrice}</span>
              {discount > 0 && (
                <span className="text-sm text-slate-400 line-through font-medium">₹{selectedVariant?.price}</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className={`text-[11px] font-bold uppercase tracking-wide ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock: ${selectedVariant?.stock} units remaining`}
              </span>
            </div>
          </div>

          {/* VARIANT SELECTION */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest  text-slate-400 mb-2 ml-1">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button 
                  key={v.pV_Id} 
                  onClick={() => setSelectedVariant(v)}
                  className={`min-w-[50px] px-3 py-2 rounded-lg border-2 text-[11px] font-bold uppercase transition-all 
                    ${selectedVariant?.pV_Id === v.pV_Id ? 'border-primary bg-primary text-white shadow-md' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  {v.pqT_Value}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mb-10 h-12">
            <div className="flex items-center border border-slate-200 rounded-xl px-2 bg-slate-50/50">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1.5 text-slate-400 hover:text-primary"><Minus className="w-3.5 h-3.5" /></button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-1.5 text-slate-400 hover:text-primary"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg 
                ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-slate-800 shadow-primary/10'}`}
            >
              <ShoppingBag className="w-4 h-4 " /> 
              {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
            </button>

            <button className="px-4 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all text-slate-400">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-6">
            <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 flex gap-4">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold uppercase text-blue-600 tracking-widest mb-1">Expert's Note</h4>
                <p className="text-[11px] leading-relaxed line-clamp-4 sm:line-clamp-none">{product.pD_Description}</p>
              </div>
            </div>

            {/* TRUST STRIP */}
            <div className="grid grid-cols-3 gap-2 py-6 border-y border-slate-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-4 h-4 text-accent" />
                <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">Fast Express</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-4 h-4 text-accent" />
                <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">Free Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">Buyer Protect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 
  );
}