"use client";
import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { productService } from "@/services/product.service";
import { authService } from "@/services/auth.service";
import { useCartStore } from "@/store/cart.store";
import { getSessionId } from "@/utils/session";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import Loader from "@/app/loading";

import {
  SlidersHorizontal,
  PackageX,
  CheckCircle2,
  X,
  Grid2X2,
  LayoutGrid,
  Rows3,
} from "lucide-react";

function ProductListContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState("best");
  const [gridView, setGridView] = useState(4);

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
            type: searchType || undefined,
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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (inStockOnly) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => v.stock > 0)
      );
    }

    filtered = filtered.filter(
      (p) => p.variants?.[0]?.price <= priceRange
    );

    if (sortBy === "low") {
      filtered.sort(
        (a, b) => a.variants[0].price - b.variants[0].price
      );
    } else if (sortBy === "high") {
      filtered.sort(
        (a, b) => b.variants[0].price - a.variants[0].price
      );
    }

    return filtered;
  }, [products, inStockOnly, priceRange, sortBy]);

  const handleQuickAdd = async (product: Product) => {
    const user = authService.getCurrentUser();
    const variant = product.variants[0];
    if (!variant) return;

    await addItem({
      userId: user ? user.id : null,
      sessionId: getSessionId(),
      productId: product.pD_ID,
      variantId: variant.pV_Id,
      qty: 1,
    });

    setToastMsg(`${product.pD_NAME} added to your bag`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <Loader />;

  const gridClass =
    gridView === 2
      ? "grid-cols-2"
      : gridView === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 relative">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50">
          <div className="bg-white shadow-xl rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="text-green-500 w-5 h-5" />
            <span className="text-sm font-semibold">{toastMsg}</span>
            <X className="w-4 h-4 cursor-pointer" onClick={() => setShowToast(false)} />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <p className="text-xs text-slate-400">
            Home / {searchMainMenu || "Catalog"}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold uppercase">
            {searchCategory || searchMainMenu || searchType || "All Products"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <select
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="best">Best Selling</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>

          {/* Grid Toggle */}
          <div className="flex items-center gap-2">
            <Grid2X2 onClick={() => setGridView(2)} className="cursor-pointer" />
            <LayoutGrid onClick={() => setGridView(3)} className="cursor-pointer" />
            <Rows3 onClick={() => setGridView(4)} className="cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Availability</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly(!inStockOnly)}
              />
              In Stock Only
            </label>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Max Price: ₹{priceRange}</h3>
            <input
              type="range"
              min="0"
              max="20000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className={`grid ${gridClass} gap-6`}>
              {filteredProducts.map((product) => (
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
              <h3 className="text-xl font-bold">
                No products match your filters
              </h3>
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