"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import { supabase } from "@repo/lib/supabaseClient";
import toast from "react-hot-toast";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to sign out";
      toast.error(message);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Don't show navbar on auth pages
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
          >
            <span className="h-10 w-10 overflow-hidden rounded-lg bg-white shadow-sm">
              <img
                src="/NagarMitra-logo.png"
                alt="NagarMitra logo"
                className="h-10 w-10 object-contain"
              />
            </span>
            <span className="sr-only">NagarMitra</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isActive("/")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/report"
              className={`font-medium transition-colors ${
                isActive("/report")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Report Issue
            </Link>
            <Link
              href="/dashboard"
              className={`font-medium transition-colors ${
                isActive("/dashboard")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Dashboard
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden md:block">
                  {user.email}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around mt-4 pt-4 border-t border-gray-200">
          <Link
            href="/"
            className={`text-sm font-medium ${
              isActive("/") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Home
          </Link>
          <Link
            href="/report"
            className={`text-sm font-medium ${
              isActive("/report") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Report
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium ${
              isActive("/dashboard") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
