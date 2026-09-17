"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Globe, Edit3, ArrowRight, Layers, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { Book } from "@/modules/books/utils/books";
import BookCard from "@/modules/books/components/BookCard";

export default function Homepage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("/api/v1/books?limit=4&sort=newest");
        if (res.ok) {
          const data = await res.json();
          setFeaturedBooks(Array.isArray(data) ? data : data.books || []);
        }
      } catch {
        // graceful fallback
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-muted/20 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6 animate-fade-in-up">
              <Sparkles size={14} />
              <span>Inclusive Translation for Indian Languages</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground font-serif leading-tight">
              Preserve heritage. <br />
              <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Translate together.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Matribhāsha brings Indian literature and stories to everyone through collaborative translation,
              community-reviewed versions, and immersive bilingual reading workspaces.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition"
              >
                <BookOpen size={16} />
                Explore Books
              </Link>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
              >
                <Edit3 size={16} />
                Launch Workspace
              </Link>
            </div>

            {/* Language Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Supported Languages:</span>
              {["Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", "Sanskrit", "Assamese"].map((lang) => (
                <span key={lang} className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Features Grid */}
      <section className="py-16 sm:py-20 border-b border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Why Matribhāsha?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Built for translators, readers, linguists, and literature enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Globe size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Dual-Pane Translation Workspace</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Compare original source pages alongside your live draft with AI assistance and paragraph-by-paragraph version control.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                <Layers size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Multi-Version Crowdsourcing</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every page preserves multiple interpretations and translations, celebrating regional nuances and dialect variations.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 mb-4">
                <MessageSquareQuote size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Vivar Literary Feed</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Select and share poetic lines, idioms, and quotes from any page to discuss literature with the multilingual community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Featured Books
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover titles currently being read and translated.
              </p>
            </div>
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <span>View catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-muted/40 animate-pulse border border-border" />
              ))}
            </div>
          ) : featuredBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-foreground">No books available yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Catalog entries will appear here once added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.uuid} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join Call to Action */}
      <section className="border-t border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl font-serif">
            Start translating or reading today
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Join our open platform dedicated to making India&apos;s literary treasures accessible across all bhashas.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
            >
              Create Free Account
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}