"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lightbulb, Menu, X, LogOut, User, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Lightbulb className="h-6 w-6 text-primary" />
            <span>Open<span className="text-primary">Pitch</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/ideas"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Ideen entdecken
            </Link>
            <Link
              href="/stories"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Storyboard
            </Link>
            {user && (
              <Link
                href="/ideas/new"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Idee pitchen
              </Link>
            )}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Theme wechseln"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium"
                >
                  {user.email?.[0]?.toUpperCase() || "U"}
                </button>
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-muted transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Abmelden
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Anmelden
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link
              href="/ideas"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              Ideen entdecken
            </Link>
            <Link
              href="/stories"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              Storyboard
            </Link>
            {user ? (
              <>
                <Link
                  href="/ideas/new"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-primary font-medium"
                >
                  Idee pitchen
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-500"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 font-medium text-primary"
              >
                Anmelden
              </Link>
            )}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
