"use client";

import { useEffect, useState } from "react";
import { useReader } from "../contexts/read.context";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import { Star, MessageSquare, Trash2, Loader2, ThumbsUp, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ReviewItem {
  _id: string;
  rating: number;
  title?: string;
  comment: string;
  language?: string;
  userId?: {
    _id: string;
    name: string;
    username?: string;
    email?: string;
  };
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

const ReviewTab = () => {
  const { book } = useReader();
  const { user } = useAuth();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const bookUUID = book?.data?.uuid;

  const fetchReviews = async () => {
    if (!bookUUID) return;
    try {
      const res = await fetch(`/api/v1/books/${bookUUID}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setStats(data.stats || {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        });
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookUUID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage("Please sign in to submit a review.");
      return;
    }
    if (!comment.trim()) {
      setErrorMessage("Please write a comment for your review.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/v1/books/${bookUUID}/reviews`, {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify({
          rating,
          title,
          comment,
          language: book?.data?.originalLanguage || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit review");
      }

      setSuccessMessage("Thank you! Your review has been published.");
      setTitle("");
      setComment("");
      await fetchReviews();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/v1/books/${bookUUID}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: getRequestHeaders(true),
      });
      if (res.ok) {
        await fetchReviews();
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left Column: Reviews List */}
      <div className="space-y-6">
        {/* Rating Summary Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Reviews & Ratings</p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-extrabold text-foreground">
                {stats.averageRating > 0 ? stats.averageRating : "—"}
              </div>
              <div>
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= Math.round(stats.averageRating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Based on {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
                </div>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="space-y-1.5 min-w-[180px]">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star] || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-3 text-right font-medium">{star}</span>
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-5 text-right text-[10px]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews Stream */}
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" /> Reader Reviews
            </h4>

            {loading ? (
              <div className="py-12 flex justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No community reviews for this book yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              reviews.map((rev) => {
                const isAuthor = user && (user.id === rev.userId?._id || (user as { _id?: string })._id === rev.userId?._id);
                const isAdmin = user?.role === "admin";
                return (
                  <div
                    key={rev._id}
                    className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 transition hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                          {(rev.userId?.name || "R").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {rev.userId?.name || "Reader"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={13}
                              className={
                                s <= rev.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                              }
                            />
                          ))}
                        </div>

                        {(isAuthor || isAdmin) && (
                          <button
                            onClick={() => handleDelete(rev._id)}
                            className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                            title="Delete review"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {rev.title && (
                      <h5 className="font-semibold text-sm text-foreground pt-1">{rev.title}</h5>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {rev.comment}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Write a Review Form */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between h-fit">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Your Review</p>
          <h3 className="mt-1 text-lg font-bold text-foreground">Leave a Book Review</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Share your reading experience and help readers and translators across languages.
          </p>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{successMessage}</span>
            </div>
          )}

          {user ? (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 rounded-md hover:bg-muted transition text-amber-500"
                    >
                      <Star
                        size={22}
                        className={
                          star <= (hoverRating || rating)
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/30"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-foreground">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Headline (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Beautiful translation and rich prose"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Detailed Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Submit Review</span>
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-xl bg-muted/40 p-5 text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                You must be logged in to leave a community review.
              </p>
              <Link
                href="/login"
                className="inline-block rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                Sign In to Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewTab;