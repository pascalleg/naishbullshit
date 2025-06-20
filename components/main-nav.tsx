"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, Menu, User as UserIcon, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Logo } from "./logo"
import { supabase } from "@/lib/supabase"
import { Database } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

// Define Profile type if not imported from supabase.ts
type Profile = Database['public']['Tables']['profiles']['Row'];

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setProfile(null);
        } else {
          setProfile(profileData);
        }
      }
      setLoading(false);
    }

    fetchUserAndProfile();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);
        if (newUser) {
           supabase.from("profiles")
            .select("*")
            .eq("id", newUser.id)
            .single()
            .then(({ data, error }) => {
              if (error) {
                console.error("Error fetching profile on auth state change:", error);
                setProfile(null);
              } else {
                setProfile(data);
              }
            });
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    {
      href: "/how-it-works",
      label: "WHAT IS ETHR?",
      active: pathname === "/how-it-works",
    },
    {
      href: "/artists",
      label: "ARTISTS",
      active: pathname === "/artists",
    },
    {
      href: "/venues",
      label: "VENUES",
      active: pathname === "/venues",
    },
    {
      href: "/production",
      label: "PRODUCTION",
      active: pathname === "/production",
    },
    {
      href: "/about",
      label: "ABOUT",
      active: pathname === "/about",
    },
  ]

  return (
    <div
      className={cn(
        "flex justify-between items-center py-4 px-6 md:px-10 w-full transition-all duration-500",
        isScrolled ? "py-2 bg-black/40 backdrop-blur-md" : "py-4 bg-transparent",
      )}
    >
      <div className="flex items-center">
        <Logo />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-light tracking-wide transition-all duration-300 hover:text-ethr-neonblue relative py-2",
              route.active ? "text-ethr-neonblue" : "text-white/80",
            )}
          >
            {route.label}
            {route.active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ethr-neonblue" />}
          </Link>
        ))}
      </nav>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10 rounded-full px-6"
              >
                <UserIcon className="mr-2 h-4 w-4" /> DASHBOARD
              </Button>
            </Link>
            <Button
              className="bg-transparent hover:bg-transparent text-white/70 hover:text-white transition-colors duration-300"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" /> LOG OUT
            </Button>
          </>
        ) : (
          <>
            <Link href="/signup">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 rounded-full px-6 backdrop-blur-sm"
              >
                SIGN UP
              </Button>
            </Link>
            <Link href="/login">
              <Button
                className="bg-transparent hover:bg-transparent text-white/70 hover:text-white transition-colors duration-300"
              >
                <LogIn className="mr-2 h-4 w-4" /> LOG IN
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-lg p-6 md:hidden z-50 animate-fade-in">
          <nav className="flex flex-col space-y-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-lg font-light tracking-wide transition-colors hover:text-ethr-neonblue",
                  route.active ? "text-ethr-neonblue" : "text-white/80",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="subtle-divider my-4"></div>
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10 w-full rounded-full"
                    >
                      <UserIcon className="mr-2 h-4 w-4" /> DASHBOARD
                    </Button>
                  </Link>
                  <Button
                    className="bg-transparent hover:bg-transparent text-white/70 hover:text-white w-full"
                    onClick={() => supabase.auth.signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> LOG OUT
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/5 w-full rounded-full backdrop-blur-sm"
                    >
                      SIGN UP
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      className="bg-transparent hover:bg-transparent text-white/70 hover:text-white w-full"
                    >
                      <LogIn className="mr-2 h-4 w-4" /> LOG IN
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
