"use client";
import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import {
  CheckCircle2,
  User,
  Phone,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    emailId: "",
    password: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authService.register(formData);
      if (res.status === 1) setIsSuccess(true);
      else setError(res.msg || "Registration failed.");
    } catch (err: any) {
      setError(err.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Account Created Successfully 🎉
          </h2>
          <p className="text-slate-500 mb-8">
            Welcome! Your account is ready. You can now log in and start shopping.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-slate-900 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 to-primary text-white items-center justify-center p-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Join Our Community
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Create your account and unlock exclusive deals, faster checkout,
            and personalized recommendations.
          </p>

          <div className="mt-12 space-y-4 text-sm text-white/70">
            <p>✔ Member-only discounts</p>
            <p>✔ Order tracking</p>
            <p>✔ Secure checkout</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Create Account
            </h2>
            <p className="text-sm text-slate-500">
              Fill in your details below
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                required
                type="text"
                placeholder="Full Name"
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                required
                type="tel"
                placeholder="Mobile Number"
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, mobileNo: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, emailId: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                required
                type={showPassword ? "text" : "password"}
                minLength={6}
                placeholder="Password"
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
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}