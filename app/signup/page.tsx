"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup() {
    if (!email || !password || !confirm) return;
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="md:min-h-screen h-[700px] bg-offwhite flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center py-5">
         <div className="h-10 w-20">
            <img src="/tagelabsmain.png" alt="" className="h-full w-full" />
          </div>
          <p className="text-navy/45 text-sm mt-1">Create your admin account</p>
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
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-navy/15 bg-offwhite text-sm text-navy outline-none focus:border-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-navy/60 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-navy/15 bg-offwhite text-sm text-navy outline-none focus:border-blue transition-colors"
              />
            </div>
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-navy hover:bg-blue disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors duration-200 mt-1"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-navy/40 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-blue hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}