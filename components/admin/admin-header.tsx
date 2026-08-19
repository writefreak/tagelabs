"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

interface AdminHeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("?");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) return;

      setUserEmail(user.email);

      const emailName = user.email.split("@")[0];
      const parts = emailName.split(/[._-]/);
      if (parts.length >= 2) {
        setUserInitials((parts[0][0] + parts[1][0]).toUpperCase());
      } else {
        setUserInitials(emailName.slice(0, 2).toUpperCase());
      }
    }
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 w-full px-3 py-3 sm:px-6 sm:py-4">
      <div className="max-w-[1200px] mx-auto bg-white rounded-2xl border border-navy/10 shadow-xs px-3.5 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3">
        {/* Left Side: Mobile Toggle + Greeting */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              aria-label="Open navigation menu"
              className="md:hidden flex flex-col justify-center items-center gap-[4px] w-9 h-9 rounded-xl hover:bg-navy/5 transition-colors shrink-0"
            >
              <span className="w-5 h-0.5 bg-navy rounded-full" />
              <span className="w-5 h-0.5 bg-navy rounded-full" />
              <span className="w-3.5 h-0.5 bg-navy rounded-full self-start ml-[6px]" />
            </button>
          )}

          {/* Greeting Text */}
          <div className="min-w-0">
            <h1 className="font-display font-semibold text-sm sm:text-base md:text-lg text-navy flex items-center gap-1.5 leading-snug truncate">
              Hello, Welcome Back{" "}
              <span className="text-sm sm:text-base">👋</span>
            </h1>
            <p className="text-navy/40 text-[11px] sm:text-xs font-normal mt-0.5 truncate">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>

        {/* Right Side: Clickable User Avatar & Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            className="flex items-center gap-2 p-1 sm:p-1.5 rounded-full hover:bg-navy/5 transition-colors group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider shadow-xs">
              {userInitials}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-navy/50 transition-transform duration-200 hidden sm:block ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* User Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-navy/10 shadow-lg p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-navy/5 mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-navy/40">
                  Signed in as
                </p>
                <p className="text-xs font-medium text-navy truncate mt-0.5">
                  {userEmail || "Admin User"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 stroke-[2]" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
