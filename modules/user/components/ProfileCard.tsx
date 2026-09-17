"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/modules/auth/contexts/authContext";
import {
  BookOpen,
  Languages,
  PencilLine,
  Sparkles,
  Loader2,
  Check,
  Heart,
  Calendar,
  Layers,
  Award,
  BookMarked,
  Share2,
  Quote,
} from "lucide-react";
import { getRequestHeaders } from "@/modules/shared/utils/request";

type ProfileCardProps = {
  username: string;
  isMe: boolean;
};

interface ProfileData {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    languages: { name?: string }[];
    role: string;
    createdAt: string;
  };
  stats: {
    contributedPages: number;
    contributedBooks: number;
    languagesCount: number;
    translatedLanguages: string[];
  };
  contributedBooks: {
    uuid: string;
    title: string;
    author: string;
    originalLanguage: string;
    genre?: string;
  }[];
}

const ProfileCard = ({ username, isMe }: ProfileCardProps) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "portfolio">("overview");
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [bioSaved, setBioSaved] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/users/profile/${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
          setBio(data.user.bio || "");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [username]);

  const saveBio = async () => {
    setSavingBio(true);
    setBioSaved(false);
    try {
      const res = await fetch("/api/v1/users/profile", {
        method: "PUT",
        headers: getRequestHeaders(true),
        body: JSON.stringify({ bio }),
      });
      if (res.ok) {
        setBioSaved(true);
        setIsEditingBio(false);
        setTimeout(() => setBioSaved(false), 2500);
      }
    } catch (err) {
      console.error("Error saving bio:", err);
    } finally {
      setSavingBio(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const u = profileData?.user;
  const stats = profileData?.stats;
  const contributedBooks = profileData?.contributedBooks || [];
  const languages = u?.languages?.length
    ? u.languages.map((l) => l.name).filter(Boolean)
    : ["Hindi", "English"];

  const memberSince = u?.createdAt
    ? new Date(u.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Member";

  const initials = (u?.name || username || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-foreground">
      {/* Hero Profile Banner */}
      <section className="relative rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Banner Gradient Backdrop */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-primary/30 via-emerald-500/20 to-purple-500/30 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-3xl border-4 border-card bg-primary text-primary-foreground text-3xl font-bold shadow-xl">
                {initials}
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {u?.name || username}
                  </h1>
                  <span className="rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                    {u?.role === "admin" ? "Curator / Admin" : "Translator"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">@{username}</p>
              </div>
            </div>

            {/* Member Info & Action */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-muted/60 border border-border px-3 py-1.5 text-xs text-muted-foreground">
                <Calendar size={13} />
                <span>Joined {memberSince}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 text-xs font-semibold">
                <Award size={13} />
                <span>{stats?.contributedPages || 0} Pages Translated</span>
              </div>
            </div>
          </div>

          {/* Bio Snippet */}
          <div className="mt-6 pt-6 border-t border-border">
            {isEditingBio ? (
              <div className="space-y-3">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a bio about your languages and passion for stories..."
                  className="w-full min-h-[90px] rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary leading-relaxed"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveBio}
                    disabled={savingBio}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
                  >
                    {savingBio ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>Save Bio</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl italic">
                  &ldquo;{bio || "Exploring bilingual literature and preserving Indian linguistic culture through collaborative translations."}&rdquo;
                </p>
                {isMe && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted transition shrink-0"
                  >
                    <PencilLine size={13} />
                    <span>Edit Bio</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Cards Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Pages Contributed
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
            {stats?.contributedPages || 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">in regional languages</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Books Translated
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
            {stats?.contributedBooks || contributedBooks.length}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">literary catalog works</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Languages
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
            {stats?.languagesCount || languages.length}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {languages.slice(0, 3).join(", ")}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Community Status
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            Active
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Verified contributor</div>
        </div>
      </section>

      {/* Main Tabbed Portfolio View */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("overview")}
              className={`text-sm font-bold pb-2 border-b-2 transition ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview & Languages
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`text-sm font-bold pb-2 border-b-2 transition ${
                activeTab === "portfolio"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Translation Works ({contributedBooks.length})
            </button>
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Languages known card */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Languages size={15} />
                <span>Languages Mastered</span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Regional Indian languages and translation pairs spoken by @{username}:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {languages.map((lang) => (
                  <span
                    key={String(lang)}
                    className="rounded-xl bg-card border border-border px-3 py-1.5 text-xs font-bold text-foreground shadow-sm"
                  >
                    {String(lang)}
                  </span>
                ))}
              </div>
            </div>

            {/* Translation Impact Card */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <Sparkles size={15} />
                <span>Literary Impact</span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Translations authored by this profile enrich open-access Indian literature for thousands of readers across the subcontinent.
              </p>
              <div className="pt-2">
                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>Open Translation Studio</span>
                  <BookOpen size={13} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* PORTFOLIO TAB */
          <div className="space-y-4">
            {contributedBooks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground space-y-2">
                <Layers className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p>No translated books published under this profile yet.</p>
                {isMe && (
                  <Link
                    href="/books"
                    className="inline-block mt-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold"
                  >
                    Browse Catalog to Translate &rarr;
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contributedBooks.map((book) => (
                  <div
                    key={book.uuid}
                    className="rounded-2xl border border-border bg-muted/20 p-5 flex flex-col justify-between hover:border-primary/40 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Original: {book.originalLanguage}</span>
                        {book.genre && <span className="font-medium">{book.genre}</span>}
                      </div>
                      <h3 className="font-bold text-base text-foreground line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Author: {book.author}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                      <Link
                        href={`/read/${book.uuid}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Read Book &rarr;
                      </Link>
                      <Link
                        href={`/workspace/${book.uuid}`}
                        className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-muted transition"
                      >
                        Studio
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfileCard;