"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { cartService } from "@/services/cart.service";
import { useCartStore } from "@/store/cart.store";
import { getSessionId } from "@/utils/session";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ emailId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { fetchCart } = useCartStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authService.login(formData);

      if (res.status === 1) {
        const guestSessionId = getSessionId();
        const userId = res.user.id;

        try {
          await cartService.mergeCart(userId, guestSessionId);
        } catch (err) {
          console.warn("Cart merge failed, continuing login");
        }

        await fetchCart(userId, guestSessionId);

        // 🎉 Show success alert
        setSuccess(true);

        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        setError(res.msg || "Invalid login credentials.");
      }
    } catch (err: any) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100">

      {/* ✅ Success Alert */}
      {success && (
        <div className="fixed top-6 z-50 animate-slide-down">
          <div className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold text-sm">
              Login successful! Redirecting…
            </span>
          </div>
        </div>
      )}

      <div className="relative max-w-xl w-full bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2.75rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-100">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-slate-800 rounded-2xl mb-6 shadow-lg">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary">
            Welcome Back
          </h1>
          <p className="text-text-muted text-sm mt-2 font-medium">
            Sign in to continue shopping securely
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <input
                type="email"
                required
                className="input-style pl-12 h-14 bg-slate-50 focus:bg-white rounded-2xl transition-all"
                placeholder="you@example.com"
                onChange={(e) =>
                  setFormData({ ...formData, emailId: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <input
                type="password"
                required
                className="input-style pl-12 h-14 bg-slate-50 focus:bg-white rounded-2xl transition-all"
                placeholder="••••••••"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl border border-red-100 font-medium animate-shake">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            disabled={loading}
            className="group w-full h-14 bg-primary hover:bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.97]"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-text-muted font-medium">
            New here?{" "}
            <Link
              href="/register"
              className="text-accent font-bold hover:text-accent-hover transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
