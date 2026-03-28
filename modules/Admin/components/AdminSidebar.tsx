"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";


const AdminSidebar: React.FC = () => {

    const [page, setPage] = useState<string>("dashboard");

    useEffect(() => {
        const url = new URL(window.location.href);

        const currentPage = url.searchParams.get("page") || "dashboard";

        setPage(currentPage);

        if (!url.searchParams.get("page")) {
            url.searchParams.set("page", "dashboard");
            window.history.replaceState({}, "", url.toString());
        }
    }, []);

    const changePage = (newPage: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set("page", newPage);
        window.history.pushState({}, "", url.toString());
        setPage(newPage);
    };

    return (
        <div className="h-full w-64 bg-background text-foreground flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-gray-700">
                Admin Panel
            </div>

            <nav className="flex-1 p-4">
                <ul>
                    <li
                        className={cn("mb-4 cursor-pointer hover:text-gray-400", page === "dashboard" && "text-blue-500")}
                        onClick={() => changePage("dashboard")}
                    >
                        Dashboard
                    </li>

                    <li
                        className={cn("mb-4 cursor-pointer hover:text-gray-400", page === "users" && "text-blue-500")}
                        onClick={() => changePage("users")}
                    >
                        Users
                    </li>

                    <li
                        className={cn("mb-4 cursor-pointer hover:text-gray-400", page === "settings" && "text-blue-500")}
                        onClick={() => changePage("settings")}
                    >
                        Settings
                    </li>

                    <li
                        className={cn("mb-4 cursor-pointer hover:text-gray-400", page === "books" && "text-blue-500")}
                        onClick={() => changePage("books")}
                    >
                        Books
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default AdminSidebar;