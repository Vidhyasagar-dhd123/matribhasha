import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  BookOpen,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "pdf-ai", label: "PDF & AI Engine", icon: Sparkles, badge: "AI" },
];

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
    <div className="h-full w-64 bg-card text-foreground border-r border-border flex flex-col">
      <div className="p-5 text-xl font-bold border-b border-border flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span>Admin Panel</span>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.id;
            return (
              <li
                key={item.id}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition select-none",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => changePage(item.id)}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={17} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {item.badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;