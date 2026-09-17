"use client";

import { useMemo } from "react";
import { useReader } from "../contexts/read.context";
import Link from "next/link";
import { Languages, BookOpen, Layers, CheckCircle2, User, ArrowRight } from "lucide-react";

interface EditionItem {
  language: string;
  authorId?: string;
  authorName?: string;
  authorUsername?: string;
  translatedPages: number;
  completionPercent: number;
  lastUpdated?: string;
}

const LanguageTab = () => {
  const { book, authors, language } = useReader();

  const editions: EditionItem[] = useMemo(() => {
    return (book?.data as unknown as { editions?: EditionItem[] })?.editions || [];
  }, [book?.data]);

  const distinctLanguages = useMemo(() => {
    const fromAuthors = (authors?.data || []).map((item) => item.language).filter(Boolean);
    const fromBook = book?.data?.translatedLanguages || [];
    const fromEditions = editions.map((e) => e.language).filter(Boolean);
    return Array.from(new Set([...fromBook, ...fromAuthors, ...fromEditions, book?.data?.originalLanguage || ""]))
      .filter(Boolean);
  }, [authors?.data, book?.data, editions]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Active Language Editions */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Language Editions & Coverage</p>
          <h3 className="mt-1 text-xl font-bold text-foreground">Community Translations</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Track translation progress across Indian languages and explore distinct translator editions.
          </p>

          <div className="mt-6 space-y-3">
            {editions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center space-y-2">
                <p className="text-sm font-semibold text-foreground">Original {book?.data?.originalLanguage || "Source"} Edition</p>
                <p className="text-xs text-muted-foreground">
                  No community translation editions have been completed yet. Be the first to start translating this book!
                </p>
                <Link
                  href={`/workspace/${book?.data?.uuid || ""}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
                >
                  <Layers size={13} /> Start Translation
                </Link>
              </div>
            ) : (
              editions.map((edition, idx) => (
                <div
                  key={`${edition.language}-${edition.authorId || idx}`}
                  className="rounded-xl border border-border bg-muted/30 p-4 space-y-3 transition hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        <Languages size={15} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                          <span>{edition.language} Edition</span>
                          {edition.completionPercent >= 100 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={11} /> Complete
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <User size={12} />
                          <span>Translated by {edition.authorName || edition.authorUsername || "Contributor"}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/read/${book?.data?.uuid || ""}?language=${encodeURIComponent(edition.language)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition"
                    >
                      <BookOpen size={12} />
                      <span>Read Edition</span>
                    </Link>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{edition.translatedPages} pages translated</span>
                      <span className="font-semibold text-foreground">{edition.completionPercent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${edition.completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Available Languages List & Notes */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">All Supported Languages</p>
          <h3 className="mt-1 text-lg font-bold text-foreground">Indexed Linguistic Versions</h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {distinctLanguages.map((item) => (
              <span
                key={item}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  language?.data === item
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-border space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground">Dynamic Multi-author Reader</p>
            <p>
              When reading this book, the platform automatically presents the highest-quality translation in your preferred Indian language, with the ability to switch between translators seamlessly.
            </p>
          </div>

          <div className="mt-6">
            <Link
              href={`/workspace/${book?.data?.uuid || ""}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
            >
              <Layers size={14} />
              <span>Contribute New Language in Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageTab;