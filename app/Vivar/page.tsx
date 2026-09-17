"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  BookOpen,
  Share2,
  Sparkles,
  Loader2,
  Trash2,
  Edit3,
  Plus,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  Smartphone,
  Quote,
  X,
  Check,
  User as UserIcon,
} from "lucide-react";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import { useAuth } from "@/modules/auth/contexts/authContext";

interface VivarPost {
  _id: string;
  selectedText: string;
  caption?: string;
  bookUUID: string;
  bookTitle: string;
  pageNumber: number;
  language: string;
  authorId?: {
    _id?: string;
    name?: string;
    username?: string;
    email?: string;
  };
  likes?: string[];
  likesCount: number;
  createdAt: string;
}

const GRADIENTS = [
  "from-amber-600/30 via-orange-500/15 to-rose-600/30",
  "from-blue-600/30 via-indigo-500/15 to-purple-600/30",
  "from-emerald-600/30 via-teal-500/15 to-sky-600/30",
  "from-rose-600/30 via-pink-500/15 to-amber-600/30",
  "from-violet-600/30 via-purple-500/15 to-indigo-600/30",
];

export default function VivarPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<VivarPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"reels" | "grid">("reels");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Edit Modal State
  const [editingPost, setEditingPost] = useState<VivarPost | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/vivar", {
        headers: getRequestHeaders(false),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } else {
        setError("Unable to load Vivar feed.");
      }
    } catch {
      setError("Network error loading Vivar feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Scroll to a specific reel index using direct container pixel offset
  const scrollToReel = useCallback((index: number) => {
    if (!containerRef.current) return;
    const sections = containerRef.current.querySelectorAll("section");
    const targetSection = sections[index];
    if (targetSection) {
      isScrollingRef.current = true;
      setCurrentIndex(index);
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
  }, []);

  // Track active visible reel on scroll
  const handleContainerScroll = () => {
    if (!containerRef.current || isScrollingRef.current) return;
    const container = containerRef.current;
    const sections = container.querySelectorAll("section");
    const containerMid = container.scrollTop + container.clientHeight / 2;

    sections.forEach((sec, idx) => {
      const el = sec as HTMLElement;
      if (el.offsetTop <= containerMid && el.offsetTop + el.offsetHeight > containerMid) {
        if (currentIndex !== idx) {
          setCurrentIndex(idx);
        }
      }
    });
  };

  // Keyboard navigation for reels (Arrow Up / Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "reels" || editingPost) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "j") {
        e.preventDefault();
        if (currentIndex < posts.length - 1) {
          scrollToReel(currentIndex + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k") {
        e.preventDefault();
        if (currentIndex > 0) {
          scrollToReel(currentIndex - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, viewMode, editingPost, posts.length, scrollToReel]);

  const handleLike = async (postId: string) => {
    if (!user) {
      alert("Please login to like posts.");
      return;
    }
    try {
      const res = await fetch(`/api/v1/vivar/${postId}/like`, {
        method: "POST",
        headers: getRequestHeaders(true),
      });
      if (res.ok) {
        const updated = await res.json();
        const userId = user._id ? String(user._id) : "";
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  likesCount: updated.likesCount,
                  likes: updated.liked
                    ? Array.from(new Set([...(p.likes || []), userId])).filter(Boolean)
                    : (p.likes || []).filter((id) => id !== userId),
                }
              : p
          )
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this Vivar reel?")) return;
    try {
      const res = await fetch(`/api/v1/vivar/${postId}`, {
        method: "DELETE",
        headers: getRequestHeaders(true),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        if (currentIndex >= posts.length - 1) {
          setCurrentIndex(Math.max(0, posts.length - 2));
        }
      }
    } catch {
      // ignore
    }
  };

  const openEditModal = (post: VivarPost) => {
    setEditingPost(post);
    setEditCaption(post.caption || "");
    setEditText(post.selectedText || "");
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingPost || !editText.trim()) return;
    setSavingEdit(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/v1/vivar/${editingPost._id}`, {
        method: "PUT",
        headers: getRequestHeaders(true),
        body: JSON.stringify({
          selectedText: editText.trim(),
          caption: editCaption.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update Vivar reel");
      }

      const updated = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p._id === editingPost._id ? { ...p, ...updated } : p))
      );
      setEditingPost(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error updating reel");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleShare = (post: VivarPost) => {
    const url = `${window.location.origin}/read/${post.bookUUID}?page=${post.pageNumber}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("Deep-link to book page copied to clipboard!");
    }
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden select-none">
      {/* Top Controls Bar */}
      <header className="border-b border-border bg-card/90 backdrop-blur shrink-0 z-30 px-4 py-2.5">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-foreground leading-tight">
                Vivar Reels
              </h1>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Scrollable literary quote stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dedicated Create Button */}
            <Link
              href="/vivar/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
            >
              <Plus size={14} />
              <span>Create Reel</span>
            </Link>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-border bg-background p-0.5">
              <button
                onClick={() => setViewMode("reels")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  viewMode === "reels"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone size={13} />
                <span className="hidden sm:inline">Reels</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid size={13} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading Vivar reels...</p>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-md my-auto rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="mx-auto max-w-md my-auto rounded-2xl border border-dashed border-border bg-card p-10 text-center space-y-3 shadow-sm">
          <Quote className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-lg font-bold text-foreground">No Vivar reels posted yet</h2>
          <p className="text-xs text-muted-foreground">
            Highlight any sentence while reading a book in the Reader, or use the Studio to create one!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/vivar/create"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              + Create in Studio
            </Link>
            <Link
              href="/books"
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      ) : viewMode === "reels" ? (
        /* INSTAGRAM REELS & YOUTUBE SHORTS FULL-HEIGHT SNAP STREAM */
        <div className="flex-1 relative w-full h-full min-h-0 overflow-hidden flex justify-center">
          {/* Scrollable Container with Native CSS Snap */}
          <div
            ref={containerRef}
            onScroll={handleContainerScroll}
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-none flex flex-col items-center"
            style={{ scrollSnapType: "y mandatory" }}
          >
            {posts.map((post, idx) => {
              const gradient = GRADIENTS[idx % GRADIENTS.length];
              const currentUserId = user?._id ? String(user._id) : "";
              const isLiked = Boolean(currentUserId && post.likes?.includes(currentUserId));
              const isOwner = Boolean(currentUserId && String(post.authorId?._id) === currentUserId);
              const isAdmin = user?.role === "admin";

              return (
                <section
                  key={post._id}
                  className="w-full h-[calc(100vh-55px)] shrink-0 snap-start snap-always flex items-center justify-center p-3 relative"
                >
                  <div className="relative w-full max-w-[420px] h-full max-h-[740px] flex items-center gap-3">
                    {/* Main Reel Video/Quote Card */}
                    <div
                      className={`relative flex-1 h-full rounded-3xl border border-border/80 bg-gradient-to-b ${gradient} bg-card shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden backdrop-blur`}
                    >
                      {/* Ambient Watermark Quote Icon */}
                      <Quote className="absolute -bottom-6 -right-6 h-48 w-48 text-foreground/5 pointer-events-none" />

                      {/* Header: Book Details & Language */}
                      <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/20 text-primary text-[10px] font-bold px-3 py-0.5 uppercase tracking-wider font-mono">
                            {post.language}
                          </span>
                          <span className="text-xs text-muted-foreground font-semibold">
                            Page {post.pageNumber}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-muted-foreground font-bold">
                          {idx + 1}/{posts.length}
                        </div>
                      </div>

                      {/* Body: Literary Quote Passages */}
                      <div className="my-auto z-10 space-y-4 py-4">
                        <blockquote className="text-xl sm:text-2xl font-serif italic text-foreground leading-relaxed drop-shadow-xs select-text">
                          &ldquo;{post.selectedText}&rdquo;
                        </blockquote>

                        {post.caption && (
                          <p className="text-xs sm:text-sm text-foreground/85 font-sans leading-relaxed border-l-2 border-primary/60 pl-3">
                            {post.caption}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Book Link & Author */}
                      <div className="z-10 pt-4 border-t border-border/40">
                        <Link
                          href={`/books/${post.bookUUID}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition line-clamp-1 flex items-center gap-1.5"
                        >
                          <BookOpen size={14} className="shrink-0 text-primary" />
                          <span>{post.bookTitle}</span>
                        </Link>
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <UserIcon size={11} />
                          <span>Shared by</span>
                          <Link
                            href={`/profile/${post.authorId?.username || ""}`}
                            className="font-semibold text-foreground hover:underline"
                          >
                            @{post.authorId?.username || post.authorId?.name || "reader"}
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* YouTube Shorts / Reels Vertical Floating Action Rail */}
                    <div className="flex flex-col items-center justify-end gap-3 pb-4 z-20 shrink-0">
                      {/* Like Action */}
                      <button
                        onClick={() => handleLike(post._id)}
                        className="group flex flex-col items-center gap-1 cursor-pointer"
                        title="Like Reel"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-card/90 border border-border shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                          <Heart
                            size={20}
                            className={
                              isLiked || post.likesCount > 0
                                ? "fill-rose-500 text-rose-500"
                                : "text-muted-foreground"
                            }
                          />
                        </div>
                        <span className="text-[11px] font-bold text-foreground font-mono">
                          {post.likesCount || 0}
                        </span>
                      </button>

                      {/* Share Action */}
                      <button
                        onClick={() => handleShare(post)}
                        className="group flex flex-col items-center gap-1 cursor-pointer"
                        title="Share Reel"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-card/90 border border-border shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                          <Share2 size={18} className="text-muted-foreground group-hover:text-foreground" />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground">Share</span>
                      </button>

                      {/* Read Full Page Action */}
                      <Link
                        href={`/read/${post.bookUUID}?page=${post.pageNumber}`}
                        className="group flex flex-col items-center gap-1"
                        title="Read Full Page in Book"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                          <BookOpen size={18} />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground">Read</span>
                      </Link>

                      {/* Edit (if author) */}
                      {isOwner && (
                        <button
                          onClick={() => openEditModal(post)}
                          className="group flex flex-col items-center gap-1 cursor-pointer"
                          title="Edit Reel"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 border border-border shadow-md transition-transform group-hover:scale-110">
                            <Edit3 size={15} className="text-muted-foreground" />
                          </div>
                        </button>
                      )}

                      {/* Delete (if author or admin) */}
                      {(isOwner || isAdmin) && (
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="group flex flex-col items-center gap-1 cursor-pointer"
                          title="Delete Reel"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 border border-destructive/40 text-destructive shadow-md transition-transform group-hover:scale-110 hover:bg-destructive/10">
                            <Trash2 size={15} />
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* Floating Vertical Navigation Arrows (YouTube Shorts style right controls) */}
          <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
            <button
              onClick={() => scrollToReel(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="h-11 w-11 rounded-full border border-border bg-card/90 backdrop-blur shadow-xl flex items-center justify-center text-foreground hover:bg-muted hover:scale-110 active:scale-95 transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Previous Reel (Up Arrow / Page Up)"
            >
              <ChevronUp size={22} />
            </button>
            <button
              onClick={() => scrollToReel(Math.min(posts.length - 1, currentIndex + 1))}
              disabled={currentIndex >= posts.length - 1}
              className="h-11 w-11 rounded-full border border-border bg-card/90 backdrop-blur shadow-xl flex items-center justify-center text-foreground hover:bg-muted hover:scale-110 active:scale-95 transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Next Reel (Down Arrow / Page Down)"
            >
              <ChevronDown size={22} />
            </button>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => {
              const currentUserId = user?._id ? String(user._id) : "";
              const isOwner = Boolean(currentUserId && String(post.authorId?._id) === currentUserId);
              const isAdmin = user?.role === "admin";

              return (
                <article
                  key={post._id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-primary/40 transition relative"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{post.bookTitle}</span>
                        <span>·</span>
                        <span>Page {post.pageNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground uppercase font-mono">
                          {post.language}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => openEditModal(post)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </button>
                        )}
                        {(isOwner || isAdmin) && (
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <blockquote className="border-l-4 border-primary pl-4 py-1 text-base font-serif italic text-foreground leading-relaxed my-3 select-text">
                      &ldquo;{post.selectedText}&rdquo;
                    </blockquote>

                    {post.caption && (
                      <p className="text-xs text-muted-foreground mt-2">{post.caption}</p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      By @{post.authorId?.username || post.authorId?.name || "reader"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                      >
                        <Heart size={13} className={post.likesCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
                        <span>{post.likesCount}</span>
                      </button>

                      <Link
                        href={`/read/${post.bookUUID}?page=${post.pageNumber}`}
                        className="rounded-full bg-primary text-primary-foreground px-3 py-1 font-semibold hover:bg-primary/90 transition"
                      >
                        Read Page
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Edit3 size={16} className="text-primary" />
                <span>Edit Vivar Reel</span>
              </div>
              <button
                onClick={() => setEditingPost(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Excerpt Text:
              </label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-input bg-background p-3 text-xs sm:text-sm font-serif text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Reflection Caption:
              </label>
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            {editError && (
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                {editError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingPost(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit || !editText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
              >
                {savingEdit ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
