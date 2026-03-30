"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="md:min-h-screen h-[700px] bg-offwhite flex items-center justify-center px-4 font-body">
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-navy/15 bg-offwhite text-sm text-navy outline-none focus:border-blue transition-colors"
              />
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