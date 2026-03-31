"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
  if (!email || !password) return;
  setLoading(true);
  setError(null);

  try {
    console.log("Attempting login...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.log("Login Error:", error.message);
      setError(error.message);
      setLoading(false);
    } else {
      console.log("Login Success! Redirecting...");
      // Use window.location.href to force a hard redirect and bypass any Next.js router lag
      window.location.href = "/admin";
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
    setError("An unexpected error occurred.");
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center px-4 font-body overflow-hidden">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center py-5">
         <div className="h-10 w-20">
            <img src="/tagelabsmain.png" alt="" className="h-full w-full" />
          </div>
          <p className="text-navy/45 text-sm mt-1">Sign in to your admin panel</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-navy/[0.08] shadow-sm">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-navy/60 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-navy/15 bg-offwhite text-sm text-navy outline-none focus:border-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-navy/60 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-[10px] border border-navy/15 bg-offwhite text-sm text-navy outline-none focus:border-blue transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 hover:text-navy/60 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye-off
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // Eye
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
                      </div>
                      <div className="flex justify-end -mt-2">
  <Link href="/forgotten-password" className="text-[12px] text-blue hover:underline">
    Forgot password?
  </Link>
</div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-navy hover:bg-blue disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors duration-200 mt-1"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-navy/40 mt-5">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}