"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { authService } from "@/services/auth.service";
import { useCartStore } from "@/store/cart.store";
import { getSessionId } from "@/utils/session";
import Loader from "@/app/loading";
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("FEATURED");
const [showLoader, setShowLoader] = useState(true);

  const { addItem } = useCartStore();

  /* ================= HERO SLIDES ================= */
  const slides = [
    {
      image: "/images/hero/slider-1.jpg",
      title1: "MEN’S",
      title2: " FASHION",
      subtitle: "New & Fresh collection arrival in believe store",
    },
    {
      image: "/images/hero/newbanner.jpg",
      title1: "50% PRICE CUT",
      title2: "FOR ONLINE ORDER",
      subtitle: "New & Fresh collection arrival in believe store",
    },
  ];

  /* ================= CATEGORIES ================= */
  const categories = [
    {
      title: "MEN",
      image: "/images/hero/cat-1.jpg",
      link: "/products?category=Men",
      classs: "justify-center items-start px-6 text-black",
    },
    {
      title: "WOMEN",
      image: "/images/hero/cat-2.jpg",
      link: "/products?category=Women",
      classs: "justify-center items-center  text-pink-600",
    },
    {
      title: "ACCESSORIES",
      image: "/images/hero/cat-3.jpg",
      link: "/products/accessories",
      classs: "justify-end items-center px-6  text-primary py-2",
    },
  ];

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getFullCatalog();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  /* ================= FILTER PRODUCTS ================= */
  const filteredProducts = products.filter((product) => {
    if (activeTab === "FEATURED") return product.pD_ID;
    if (activeTab === "NEW ARRIVALS") return true;
    if (activeTab === "BEST SELLER") return product.pD_ID === 2;
    return true;
  });

  /* ================= QUICK ADD ================= */
  const handleQuickAdd = async (product: Product) => {
    const user = authService.getCurrentUser();
    const variant = product.variants?.[0];
    if (!variant) return;

    try {
      await addItem({
        userId: user ? user.id : null,
        sessionId: getSessionId(),
        productId: product.pD_ID,
        variantId: variant.pV_Id,
        qty: 1,
      });
    } catch (err) {
      console.error("Quick add failed", err);
    }
  };
useEffect(() => {
  const timer = setTimeout(() => {
    setShowLoader(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);
if (showLoader) {
  return <Loader />;
}
 
  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden"
>
  <AnimatePresence mode="wait">
    <motion.div
      key={current}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0"
    >
      {/* Background Image */}
      <img
        src={slides[current].image}
        className="w-full h-full object-cover"
        alt="Slide background"
      />

      {/* ===== MOBILE OVERLAY ===== */}
      <div className="absolute inset-0 bg-black/50 md:hidden" />

      {/* ===== DESKTOP OVERLAYS ===== */}
      {(current === 0 || current === 1) && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/70 to-transparent hidden md:block" />
          <div className="absolute inset-0  via-transparent to-transparent hidden md:block" />
        </>
      )}

      <div className="absolute inset-0 flex items-center  bg-gradient-to-l from-pink-500/50  ">
        <div className="max-w-7xl mx-auto px-6 w-full ">

          {/* ============================= */}
          {/* ========= MOBILE VIEW ======= */}
          {/* ============================= */}
          <div className="flex flex-col items-center text-center text-white md:hidden ">

            <h2 className="text-3xl sm:text-4xl font-bold text-sky-400 ">
              {slides[current].title1}
            </h2>

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              {current === 0 ? ( <><span className="text-pink-500">WOMEN'S </span>
      {slides[current].title2}
    </> ) : ( slides[current].title2 )}
            </h1>

            <p className="mt-6 text-sm text-slate-200">
              {slides[current].subtitle}
            </p>

            <Link
              href="/products"
              className="inline-block mt-8 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold transition"
            >
              SHOP NOW
            </Link>
          </div>
 
          <div className="hidden md:flex justify-between items-center text-white">

            {/* LEFT SIDE (ONLY FIRST SLIDE) */}
            {current === 0 && (
              <div className="max-w-xl">
                <motion.h2
                  key={slides[current].title1}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sky-400 text-5xl font-bold"
                >
                  {slides[current].title1}
                </motion.h2>

                <motion.h1
                  key={slides[current].title2}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-5xl font-bold mt-2"
                >
                  {slides[current].title2}
                </motion.h1>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-lg text-slate-200"
                >
                  {slides[current].subtitle}
                </motion.p>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link
                    href="/products"
                    className="inline-block mt-8 px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold"
                  >
                    SHOP NOW
                  </Link>
                </motion.div>
              </div>
            )}

            {/* RIGHT SIDE (ALL SLIDES) */}
            <motion.div
              key={`right-${current}`}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="ml-auto text-right max-w-md"
            >
              <h2 className="text-pink-400 text-5xl font-bold">
                {current === 0 ? "WOMEN’S" : slides[current].title1}
              </h2>

              <h1 className="text-white text-5xl font-bold mt-2">
                {current === 0 ? "FASHION" : slides[current].title2}
              </h1>

              <p className="mt-6 text-slate-200">
                {current === 0
                  ? "Discover elegance and modern trends curated just for you."
                  : slides[current].subtitle}
              </p>

              <Link
                href="/products"
                className="inline-block mt-8 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold transition"
              >
                SHOP NOW
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  </AnimatePresence>

  {/* ===== DOT NAVIGATION ===== */}
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrent(index)}
        aria-label={`Go to slide ${index + 1}`}
        className={`w-3 h-3 rounded-full transition-all ${
          index === current
            ? "bg-white scale-125"
            : "bg-white/40"
        }`}
      />
    ))}
  </div>
</section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-14 md:py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl group"
              >
                <Link href={cat.link}>
                  <div className="relative h-[280px] sm:h-[320px] md:h-[420px]">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div
                      className={`absolute inset-0 flex flex-col ${cat.classs} `}
                    >
                      <h3 className="text-3xl md:text-4xl font-bold">
                        {cat.title}
                      </h3>
                      <span className="mt-4 border border-white px-4 py-2 text-sm">
                        Shop Now
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* Tabs */}
          <div className="flex justify-center flex-wrap gap-6 md:gap-10 mb-10 text-sm md:text-base font-semibold">
            {["FEATURED", "NEW ARRIVALS", "BEST SELLER"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 ${
                  activeTab === tab
                    ? "text-black"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-sky-500" />
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-10">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.slice(0, 12).map((product) => (
                <ProductCard
                  key={product.pD_ID}
                  product={product}
                  onQuickAdd={() => handleQuickAdd(product)}
                />
              ))}
            </div>
          )}

        </div>
      </section>
 <section className="w-full h-[490px] md:h-[520px] relative overflow-hidden">

  {/* Animated Background Image */}
  <motion.img
    src="/images/hero/newbanner.jpg"
    alt="Tommy Hilfiger Women"
    initial={{ scale: 1.2 }}
    animate={{ scale: 1.1 }}
    transition={{ duration: 2, ease: "easeOut" }}
    className="absolute inset-0 w-full h-full object-cover object-[20%_center]"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/10" />

  {/* Content */}
  <div className="relative z-10 h-full flex items-center">
    <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
      
      <div className="md:ml-auto md:max-w-lg text-center md:text-left">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1f2a44] leading-tight"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            TOMMY
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            HILFIGER
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-pink-400 block"
          >
            WOMEN'S
          </motion.span>
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-sm md:text-base text-slate-700 leading-relaxed"
        >
          The generated Lorem Ipsum is therefore always free from repetition,
          injected humour or non-characteristic words.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 text-sm font-semibold transition duration-300"
        >
          DISCOVER MORE PRODUCT
        </motion.button>

      </div>
    </div>
  </div>
</section>
    </div>
  );
}