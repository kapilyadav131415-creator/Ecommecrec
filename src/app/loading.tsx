"use client";

import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Package, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">

      <div className="relative text-center space-y-8">

        {/* Floating Icons */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute -top-10 -left-16 text-sky-400 opacity-30"
        >
          <CreditCard size={40} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
          className="absolute -top-10 -right-16 text-pink-400 opacity-30"
        >
          <Package size={40} />
        </motion.div>

        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-yellow-400 opacity-30"
        >
          <Sparkles size={36} />
        </motion.div>

        {/* Main Animated Shopping Bag */}
        <div className="relative flex items-center justify-center">
          
          {/* Glow */}
          <div className="absolute h-32 w-32 rounded-full bg-sky-200 blur-3xl opacity-40 animate-pulse" />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-white shadow-xl rounded-3xl p-8"
          >
            <ShoppingBag size={48} className="text-sky-500" />
          </motion.div>

        </div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold tracking-wide text-slate-800"
        >
          MY<span className="text-sky-500">SHOP</span>
        </motion.h1>

        {/* Loading Text */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-600">
            Preparing your shopping experience
          </p>

          {/* Animated Progress Bar */}
          <div className="w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden mx-auto">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-full w-1/2 bg-sky-500 rounded-full"
            />
          </div>
        </div>

      </div>
    </div>
  );
}