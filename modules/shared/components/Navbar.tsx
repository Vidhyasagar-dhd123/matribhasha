"use client"
import Link from "next/link";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { useState, useEffect } from "react";

const Navbar = () => {
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
        <>
            <div className="flex justify-around sticky top-0 bg-white dark:bg-gray-900 z-50 text-black dark:text-white">
                <div className="p-4">Matribhasha</div>
                <div className="items-center justify-center mx-4 hidden md:flex">
                    <Link className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded" href="/">Homepage</Link>
                    <Link className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded" href="/Books">Books</Link>
                    <Link className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded" href="/Dashboard">Dashboard</Link>
                    {user ? (
                        <>
                            <Link className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded" href="/Profile">Profile</Link>
                            <button className="cursor-pointer bg-red-700 px-2 py-1 text-white rounded hover:bg-red-800 m-2" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <Link className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded" href="/Login">LogIn</Link>
                    )}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 ml-4"
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
