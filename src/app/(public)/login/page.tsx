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
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ emailId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        } catch (err) {}

        await fetchCart(userId, guestSessionId);

        setSuccess(true);
        setTimeout(() => router.push("/profile"), 1500);
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
    <div className="min-h-screen flex">

      {/* Left Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-slate-900 text-white items-center justify-center p-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Welcome Back 👋
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Login to access your account, manage orders, and enjoy a seamless
            shopping experience.
          </p>

          <div className="mt-12 space-y-4 text-sm text-white/70">
            <p>✔ Secure checkout</p>
            <p>✔ Easy order tracking</p>
            <p>✔ Exclusive member offers</p>
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12">

        {success && (
          <div className="fixed top-6 z-50">
            <div className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-xl">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold">
                Login successful! Redirecting...
              </span>
            </div>
          </div>
        )}

        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Sign In
            </h2>
            <p className="text-sm text-slate-500">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  onChange={(e) =>
                    setFormData({ ...formData, emailId: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}