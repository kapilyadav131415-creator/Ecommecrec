"use client";
import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { CheckCircle2, User, Phone, Mail, Lock, Loader2, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", mobileNo: "", emailId: "", password: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authService.register(formData);
      if (res.status === 1) setIsSuccess(true);
      else setError(res.msg || "Registration could not be completed.");
    } catch (err: any) {
      setError(err.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center animate-in zoom-in duration-700 max-w-sm">
          <div className="bg-green-50 h-24 w-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary">Account Verified</h2>
          <p className="text-text-muted mt-4 mb-10 leading-relaxed">Your registration is complete. Welcome to the world of premium shopping.</p>
          <Link href="/login" className="btn-primary px-12 inline-flex">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16">
      <div className="auth-card max-w-xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl mb-6">
            <Sparkles className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary">Member Registration</h1>
          <p className="text-text-muted text-sm mt-2">Join our exclusive shopping community</p>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input required type="text" className="input-style pl-12" placeholder="Alex Morgan" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Mobile No.</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input required type="tel" className="input-style pl-12" placeholder="9876543210"
                onChange={(e) => setFormData({...formData, mobileNo: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Email ID</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input required type="email" className="input-style pl-12" placeholder="alex@choice.com"
                onChange={(e) => setFormData({...formData, emailId: e.target.value})} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input required type="password" minLength={6} className="input-style pl-12" placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          {error && <div className="md:col-span-2 bg-red-50 text-red-600 text-[11px] p-4 rounded-xl">{error}</div>}

          <button className="md:col-span-2 btn-primary mt-4">
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Verify & Create Account"}
          </button>
        </form>

        <p className="text-center mt-10 text-sm text-text-muted">
          Already a member?{" "}
          <Link href="/login" className="text-accent font-bold hover:underline">Sign In Here</Link>
        </p>
      </div>
    </div>
  );
}