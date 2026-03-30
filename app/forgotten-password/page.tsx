"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="mmd:in-h-screen h-[700px] bg-offwhite flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center py-5">
          <div className="h-10 w-20">
            <img src="/tagelabsmain.png" alt="" className="h-full w-full" />
          </div>
          <p className="text-navy/45 text-sm mt-1">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-navy/[0.08] shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-navy font-semibold text-sm">Check your email</p>
              <p className="text-navy/50 text-sm">We sent a reset link to <span className="text-navy font-medium">{email}</span></p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">
                  {error}
                </div>
              )}
              <p className="text-navy/50 text-sm">Enter your email and we'll send you a link to reset your password.</p>
              <div>
                <label className="block text-[11px] font-semibold text-navy/60 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-navy/15 bg-offwhite text-sm text-navy outline-none focus:border-blue transition-colors"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-navy hover:bg-blue disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors duration-200 mt-1"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-navy/40 mt-5">
          <Link href="/login" className="text-blue hover:underline font-medium">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}