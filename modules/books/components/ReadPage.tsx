"use client";

import { useEffect, useState } from "react";
import { useReader } from "../contexts/read.context";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import { Sparkles, X, Check, Loader2 } from "lucide-react";
import Link from "next/link";

const ReadPage = () => {
  const { content, page, book, author, language } = useReader();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Text selection for quote to Vivar Reel
  const [selectedText, setSelectedText] = useState("");
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [showVivarModal, setShowVivarModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [postingVivar, setPostingVivar] = useState(false);
  const [vivarSuccess, setVivarSuccess] = useState(false);
  const [vivarError, setVivarError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const getPageVersion = async () => {
      if (!page?.data?.bookUUID || page?.data?.pageNumber === undefined) return;
      setLoading(true);

      const params = new URLSearchParams();
      if (author?.data?.authorId?.email) params.append("author", author.data.authorId.email);
      if (language?.data) params.append("language", language.data);

      const query = params.toString() ? `?${params.toString()}` : "";
      try {
        const data = await fetch(
          `/api/v1/pages/${page.data.bookUUID}/${page.data.pageNumber}${query}`
        );
        if (data.ok && isMounted) {
          const requested_page = await data.json();
          content.set(requested_page);
        } else if (isMounted) {
          content.set(null);
        }
      } catch (err) {
        console.error("Error fetching page:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getPageVersion();
    return () => {
      isMounted = false;
    };
  }, [page?.data?.pageNumber, page?.data?.bookUUID, author?.data, language?.data]);

  // Auto-track reading progress for authenticated user
  useEffect(() => {
    const bookUUID = page?.data?.bookUUID;
    const pageNumber = page?.data?.pageNumber;
    if (!user || !bookUUID || pageNumber === undefined) return;

    const timer = setTimeout(async () => {
      try {
        await fetch("/api/v1/users/progress", {
          method: "POST",
          headers: getRequestHeaders(true),
          body: JSON.stringify({
            bookUUID,
            pageNumber,
            language: language?.data || book?.data?.originalLanguage || "en",
            role: "reader",
          }),
        });
      } catch (err) {
        console.error("Error updating reading progress:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, page?.data?.pageNumber, page?.data?.bookUUID, language?.data, book?.data?.originalLanguage]);

  // Handle Text Selection for Vivar
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setTooltipPos(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 6) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    } else {
      setTooltipPos(null);
    }
  };

  const handlePostVivar = async () => {
    if (!selectedText.trim() || !book.data?.uuid || page.data?.pageNumber === undefined) return;
    setPostingVivar(true);
    setVivarError(null);

    try {
      const res = await fetch("/api/v1/vivar", {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify({
          selectedText,
          caption,
          bookUUID: book.data.uuid,
          pageNumber: page.data.pageNumber,
          language: language?.data || book.data.originalLanguage || "en",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to post Vivar reel");
      }

      setVivarSuccess(true);
      setTimeout(() => {
        setShowVivarModal(false);
        setVivarSuccess(false);
        setSelectedText("");
        setCaption("");
      }, 2000);
    } catch (err) {
      setVivarError(err instanceof Error ? err.message : "Error creating Vivar reel");
    } finally {
      setPostingVivar(false);
    }
  };

  return (
    <div
      className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 relative min-h-[82vh]"
      onMouseUp={handleMouseUp}
    >
      {/* Floating Tooltip when text is selected */}
      {tooltipPos && !showVivarModal && (
        <div
          style={{
            position: "fixed",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 50,
          }}
        >
          <button
            onClick={() => setShowVivarModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-4 py-2 text-xs font-semibold shadow-2xl hover:scale-105 transition-transform"
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>Quote to Vivar</span>
          </button>
        </div>
      )}

      {/* Main Book Reader Sheet */}
      {!loading && (
        <div className="min-h-[78vh] w-full max-w-4xl p-8 sm:p-12 md:p-16 flex flex-col justify-between text-justify leading-relaxed bg-card text-card-foreground border border-border/80 rounded-2xl shadow-lg relative my-2">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-3">
            <span className="font-semibold text-foreground/80">{book?.data?.title}</span>
            <span className="uppercase font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground">
              {language?.data || book?.data?.originalLanguage || "en"}
            </span>
          </div>

          {/* Book Content */}
          <div className="grow w-full py-4 text-base sm:text-lg md:text-xl font-serif leading-loose tracking-wide first-letter:text-4xl first-letter:font-bold first-letter:mr-2 select-text whitespace-pre-wrap text-foreground">
            {content?.data?.content || "No translation available for this page in the selected language."}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span className="tracking-wide">Matribhāsha Reader</span>
            <span className="font-mono text-sm font-bold text-foreground">
              {(page?.data?.pageNumber !== undefined ? page.data.pageNumber : 1).toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex h-96 items-center justify-center text-lg text-muted-foreground gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading page...</span>
        </div>
      )}

      {/* Vivar Reel Creation Modal */}
      {showVivarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles size={16} className="text-amber-500" />
                <span>Share as Vivar Reel</span>
              </div>
              <button
                onClick={() => setShowVivarModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm italic font-serif leading-relaxed text-foreground">
              &ldquo;{selectedText}&rdquo;
            </div>

            <div className="text-xs text-muted-foreground">
              From <strong className="text-foreground">{book?.data?.title}</strong> · Page{" "}
              {page?.data?.pageNumber ?? 1} ({language?.data || "en"})
            </div>

            <textarea
              placeholder="Add your reflection on this passage..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full min-h-[80px] rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition"
            />

            {vivarError && (
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                {vivarError}
              </p>
            )}

            {vivarSuccess ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 text-sm font-medium">
                <Check size={16} />
                <span>Published to Vivar Reels!</span>
                <Link href="/vivar" className="ml-auto underline font-semibold">
                  View Feed &rarr;
                </Link>
              </div>
            ) : (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowVivarModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostVivar}
                  disabled={postingVivar || !user}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {postingVivar ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{user ? "Post to Vivar" : "Login to Post"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadPage;