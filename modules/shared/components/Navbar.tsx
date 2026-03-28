"use client"
import Link from "next/link";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";


const Navbar = () => {
    function navLinkClass(href: string, pathname: string) {
      const isActive =
          pathname === href || pathname.startsWith(`${href}/`);

      return [
          "text-sm font-medium transition-colors",
          isActive
          ? "text-foreground border-b-2 border-primary"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ");
    }
    const pathname = usePathname();

    const { user, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load saved theme or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // Toggle theme and save preference
    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

return (
  <header className="sticky top-0 z-50 bg-background/50 backdrop-blur border-b border-border">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
      
      <div className="text-lg font-semibold tracking-tight text-foreground md:text-start text-center w-full">
        Matribhāsha
      </div>

      <div className="hidden items-center gap-6 md:flex">
        <Link href="/" className={navLinkClass("/", pathname)}>
          Home
        </Link>

        <Link href="/Books" className={navLinkClass("/Books", pathname)}>
          Books
        </Link>

        <Link href="/Dashboard" className={navLinkClass("/Dashboard", pathname)}>
          Dashboard
        </Link>

        {user ? (
          <>
            <Link href="/Profile" className={navLinkClass("/Profile", pathname)}>
              Profile
            </Link>

            <button
              onClick={logout}
              className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/Login" className={navLinkClass("/Login", pathname)}>
            Login
          </Link>
        )}

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full
                     border border-border bg-secondary text-secondary-foreground
                     hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  </header>
);


};

export default Navbar;
