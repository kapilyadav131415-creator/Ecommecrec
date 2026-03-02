"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productService } from "@/services/product.service";
import { authService } from "@/services/auth.service";
import { useCartStore } from "@/store/cart.store";
import { getSessionId } from "@/utils/session";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { Loader2, SlidersHorizontal, PackageX, CheckCircle2, X, ChevronDown } from "lucide-react";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import Loader from "@/components/common/Loader";

 
 
function ProductListContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const { addItem } = useCartStore();
  const searchMainMenu = searchParams.get("mainMenu");
  const searchCategory = searchParams.get("category");
  const searchType = searchParams.get("type");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let data;
        if (searchMainMenu || searchCategory || searchType) {
          data = await productService.getFilteredCatalog({ 
            mainMenu: searchMainMenu || undefined, 
            category: searchCategory || undefined, 
            type: searchType || undefined 
          });
        } else {
          data = await productService.getFullCatalog();
        }
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchMainMenu, searchCategory, searchType]);

  const handleQuickAdd = async (product: Product) => {
    const user = authService.getCurrentUser();
    const variant = product.variants[0];

    if (!variant) return;

    try {
      await addItem({
        userId: user ? user.id : null,
        sessionId: getSessionId(),
        productId: product.pD_ID,
        variantId: variant.pV_Id,
        qty: 1
      });

      setToastMsg(`${product.pD_NAME} added to your bag.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Quick add failed", err);
    }
  };


  if (loading) return (
     <Loader/>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 relative">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in fade-in slide-in-from-right-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div className="flex-1 text-xs font-bold text-primary">{toastMsg}</div>
            <X className="h-4 w-4 text-slate-300 cursor-pointer" onClick={() => setShowToast(false)} />
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <div className="text-xs text-slate-400 mb-2">Home &gt; {searchMainMenu || "Catalog"}</div>
        <h1 className="text-1xl md:text-3xl font-semibold text-primary uppercase mb-6">
          {searchCategory || searchMainMenu || searchType}
        </h1>
        
        <div className="flex items-center justify-between border-y border-slate-100 py-4">
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex lg:hidden items-center gap-2 font-bold uppercase text-xs"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest">
            Filters
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold">
              <span className="text-slate-400">Sort by</span>
              <select className="bg-transparent focus:outline-none">
                <option>Best selling</option>
                <option>Price: Low to High</option>
              </select>
            </div>
            <div className="text-xs font-bold text-slate-400">
              Showing <span className="text-primary">{products.length}</span> items
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center font-bold text-sm mb-4">Availability <ChevronDown className="w-4 h-4" /></div>
            <div className="space-y-2 text-sm text-slate-600">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-300" /> In stock ({products.length})</label>
              <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" disabled className="rounded border-slate-300" /> Out of stock (0)</label>
            </div>
          </div>
          <div className="border-b pb-4">
            <div className="flex justify-between items-center font-bold text-sm mb-4">Price <ChevronDown className="w-4 h-4" /></div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.pD_ID} 
                  product={product} 
                  onQuickAdd={() => handleQuickAdd(product)} 
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <PackageX className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary">No products found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <ProductListContent />
    </Suspense>
  );
}