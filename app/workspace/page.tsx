"use client"

import { ActivityPanel } from "@/modules/workspace/components/ActivityPanel";
import { SearchBar } from "@/modules/workspace/components/SearchBar";
import { useState } from "react";
import { Loader2, Languages, ArrowRight, Clipboard, Check } from "lucide-react";
import { useAuth } from "@/modules/auth/contexts/authContext";

const INDIAN_LANGUAGES = [
  "Hindi", "Bengali", "Telugu", "Marathi", "Tamil",
  "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam",
  "Punjabi", "Assamese", "Sanskrit", "English",
];

const WorkspacePage = () => {
  const { token } = useAuth();
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Hindi");
  const [translated, setTranslated] = useState("");
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setTranslating(true);
    setError(null);
    setTranslated("");

    try {
      const response = await fetch("/api/v1/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || "Translation failed. Please try again.");
      }

      const data = await response.json();
      setTranslated(data.translatedText || data.result || data.translation || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Translation failed.");
    } finally {
      setTranslating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translated);
    setTranslated(sourceText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">

        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-muted">Workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Translate, search, and explore
          </h1>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            AI-assisted translation across Indian languages, plus quick access to your books and activity.
          </p>
        </div>

        {/* Translation Panel */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Languages size={18} />
            </div>
            <h2 className="text-base font-semibold text-foreground">AI Translation</h2>
          </div>

          {/* Language selectors */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            >
              {INDIAN_LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button
              onClick={swapLanguages}
              aria-label="Swap languages"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ArrowRight size={15} className="rotate-0" />
            </button>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            >
              {INDIAN_LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Text areas */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">{sourceLang}</label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={`Type text in ${sourceLang}…`}
                className="min-h-[160px] w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">{targetLang}</label>
                {translated && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Clipboard size={12} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              <div className="relative min-h-[160px] w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
                {translating ? (
                  <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 size={16} className="animate-spin" />
                    Translating…
                  </div>
                ) : translated ? (
                  <p className="leading-7 whitespace-pre-wrap">{translated}</p>
                ) : (
                  <p className="text-muted-foreground">Translation will appear here.</p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleTranslate}
              disabled={translating || !sourceText.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {translating ? <Loader2 size={15} className="animate-spin" /> : <Languages size={15} />}
              {translating ? "Translating…" : "Translate"}
            </button>
          </div>
        </div>

        {/* Search + Activity */}
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <SearchBar />
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;