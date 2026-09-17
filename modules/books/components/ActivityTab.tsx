"use client";

import { useEffect, useState } from "react";
import { useReader } from "../contexts/read.context";
import { Clock, Layers, Star, Sparkles, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  type: "translation" | "review" | "vivar";
  title: string;
  author: string;
  timestamp: string;
}

const ActivityTab = () => {
  const { book, page, authors } = useReader();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const bookUUID = book?.data?.uuid;

  useEffect(() => {
    if (!bookUUID) return;
    const fetchActivity = async () => {
      try {
        const res = await fetch(`/api/v1/books/${bookUUID}/activity`);
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch (err) {
        console.error("Error fetching book activity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [bookUUID]);

  const getIcon = (type: string) => {
    switch (type) {
      case "translation":
        return <Layers className="h-4 w-4 text-emerald-500" />;
      case "review":
        return <Star className="h-4 w-4 text-amber-500 fill-amber-500" />;
      case "vivar":
        return <Sparkles className="h-4 w-4 text-rose-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Activity Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Community Activity</p>
        <h3 className="mt-1 text-xl font-bold text-foreground">Recent Events & Contributions</h3>

        {loading ? (
          <div className="py-12 flex justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : activities.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">
              No recent events logged yet. Start reading, reviewing, or translating to make history!
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {activities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3.5 transition hover:border-primary/40"
              >
                <div className="mt-0.5 p-2 rounded-lg bg-card border border-border">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2">
                    {item.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>By {item.author}</span>
                    <span>·</span>
                    <span>
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book Statistics Card */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Book Stats</p>
            <h3 className="mt-1 text-lg font-bold text-foreground">Catalog Footprint</h3>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-center">
                <div className="text-2xl font-bold text-foreground">{book?.data?.totalPages || book?.data?.pages?.length || 0}</div>
                <div className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">Pages</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-center">
                <div className="text-2xl font-bold text-foreground">{(authors?.data || []).length || 1}</div>
                <div className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">Languages</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-center">
                <div className="text-2xl font-bold text-foreground">{book?.data?.contributors || 0}</div>
                <div className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">Translators</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-center">
                <div className="text-2xl font-bold text-foreground">{book?.data?.rating ? `★ ${book.data.rating}` : "—"}</div>
                <div className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">Avg Rating</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border">
            <Link
              href={`/workspace/${book?.data?.uuid || ""}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
            >
              <Layers size={14} />
              <span>Contribute to this Book</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTab;