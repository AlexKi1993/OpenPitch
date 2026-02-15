"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lightbulb, Menu, X, LogOut, User, LayoutDashboard, Sun, Moon, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
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

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    async function fetchUnread() {
      // Get collaborator IDs where user is participant (as applicant or idea author)
      const { data: asApplicant } = await supabase
        .from("collaborators")
        .select("id")
        .eq("user_id", user!.id);

      const { data: asAuthor } = await supabase
        .from("collaborators")
        .select("id, idea:ideas!inner(author_id)")
        .eq("idea.author_id", user!.id);

      const collabIds = new Set<string>();
      asApplicant?.forEach((c) => collabIds.add(c.id));
      asAuthor?.forEach((c) => collabIds.add(c.id));

      if (collabIds.size === 0) {
        setUnreadCount(0);
        return;
      }

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("collaborator_id", Array.from(collabIds))
        .neq("sender_id", user!.id)
        .eq("is_read", false);

      setUnreadCount(count || 0);
    }

    fetchUnread();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

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
            <Link
              href="/lessons"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Lessons
            </Link>
            {user && (
              <Link
                href="/ideas/new"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Idee pitchen
              </Link>
            )}
            {user && (
              <Link
                href="/inbox"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Inbox"
              >
                <Mail className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
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
            <Link
              href="/lessons"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              Lessons
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
                  href="/inbox"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Inbox
                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
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
