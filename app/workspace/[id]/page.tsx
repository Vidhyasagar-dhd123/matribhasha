"use client";

import React, { use, useEffect, useState } from "react";
import { OuterContainer } from "@/modules/workspace/components/ReferencePage";
import { ReadProvider, useReader } from "@/modules/books/contexts/read.context";
import PageList from "@/modules/books/components/PageList";
import Link from "next/link";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import { Sparkles, Loader2, Check, ArrowLeft, BookOpen, Edit3 } from "lucide-react";

const LANGUAGE_CODES = [
  { code: "hin_Deva", name: "Hindi (हिन्दी)" },
  { code: "mar_Deva", name: "Marathi (मराठी)" },
  { code: "tam_Taml", name: "Tamil (தமிழ்)" },
  { code: "tel_Telu", name: "Telugu (తెలుగు)" },
  { code: "guj_Gujr", name: "Gujarati (ગુજરાતી)" },
  { code: "ben_Beng", name: "Bengali (বাংলা)" },
  { code: "kan_Knda", name: "Kannada (ಕನ್ನಡ)" },
  { code: "mal_Mlym", name: "Malayalam (മലയാളം)" },
  { code: "pan_Guru", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "ory_Orya", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "urd_Arab", name: "Urdu (اردو)" },
  { code: "asm_Beng", name: "Assamese (অসমীয়া)" },
  { code: "san_Deva", name: "Sanskrit (संस्कृतम्)" },
  { code: "npi_Deva", name: "Nepali (नेपाली)" },
  { code: "mai_Deva", name: "Maithili (मैथिली)" },
  { code: "bho_Deva", name: "Bhojpuri (भोजपुरी)" },
];

function WorkspaceEditor({
  targetLang,
  setTargetLang,
  draftContent,
  setDraftContent,
  handleAIAssist,
  translating,
  status,
}: {
  targetLang: string;
  setTargetLang: (l: string) => void;
  draftContent: string;
  setDraftContent: (c: string) => void;
  handleAIAssist: () => void;
  translating: boolean;
  status: string | null;
}) {
  const { page } = useReader();

  return (
    <div className="h-full flex flex-col font-sans min-h-0 gap-3">
      {/* Target Language & AI Assist Selector */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground">Target Language:</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold text-foreground outline-none focus:border-primary"
          >
            {LANGUAGE_CODES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAIAssist}
          disabled={translating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold hover:bg-emerald-500/20 transition disabled:opacity-50"
          title="Auto-translate reference text into target language"
        >
          {translating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          <span>AI Assist</span>
        </button>
      </div>

      <textarea
        value={draftContent}
        onChange={(event) => setDraftContent(event.target.value)}
        className="w-full flex-1 resize-none rounded-xl border border-input bg-background p-4 outline-none text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary leading-relaxed font-serif"
        placeholder={`Write or refine your translation in ${targetLang} here...`}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground shrink-0">
        <div>
          {status ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
              <Check size={13} /> {status}
            </span>
          ) : (
            `Editing Page ${page.data?.pageNumber ?? 1} in [${targetLang}]`
          )}
        </div>
      </div>
    </div>
  );
}

function WorkspaceContainer({ id }: { id: string }) {
  const { page, book, language } = useReader();
  const [targetLang, setTargetLang] = useState<string>("hin");
  const [draftContent, setDraftContent] = useState<string>("");
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"ref" | "edit">("ref");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activePageNumber = page?.data?.pageNumber ?? 1;

  // Load existing target draft when page or target language changes
  useEffect(() => {
    let isMounted = true;
    const fetchTarget = async () => {
      const bookUuid = book.data?.uuid || id;
      if (!bookUuid) return;
      try {
        const res = await fetch(
          `/api/v1/pages/${bookUuid}/${activePageNumber}?language=${encodeURIComponent(targetLang)}`
        );
        if (res.ok && isMounted) {
          const data = await res.json();
          setDraftContent(data?.content || "");
        } else if (isMounted) {
          setDraftContent("");
        }
      } catch {
        if (isMounted) setDraftContent("");
      }
    };

    fetchTarget();
    return () => {
      isMounted = false;
    };
  }, [activePageNumber, book.data?.uuid, id, targetLang]);

  // AI Assist
  const handleAIAssist = async () => {
    const bookUuid = book.data?.uuid || id;
    if (!bookUuid) return;
    setTranslating(true);
    setStatus(null);

    try {
      // First get reference text
      const srcLang = language?.data || book.data?.originalLanguage || "eng_Latn";
      const refRes = await fetch(
        `/api/v1/pages/${bookUuid}/${activePageNumber}?language=${encodeURIComponent(srcLang)}`
      );
      let refText = "";
      if (refRes.ok) {
        const refJson = await refRes.json();
        refText = refJson?.content || "";
      }

      if (!refText.trim()) {
        throw new Error("No reference text found to translate");
      }

      // Break text into sentences/chunks <= 250 characters for user translation assist
      const splitIntoChunks = (text: string, maxLen = 240): string[] => {
        const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
        const chunks: string[] = [];
        let currentChunk = "";

        for (const sentence of sentences) {
          if ((currentChunk + sentence).length > maxLen) {
            if (currentChunk.trim()) chunks.push(currentChunk.trim());
            // If single sentence is itself > maxLen, split on words
            if (sentence.length > maxLen) {
              const words = sentence.split(" ");
              let wordChunk = "";
              for (const w of words) {
                if ((wordChunk + " " + w).length > maxLen) {
                  if (wordChunk.trim()) chunks.push(wordChunk.trim());
                  wordChunk = w;
                } else {
                  wordChunk += (wordChunk ? " " : "") + w;
                }
              }
              if (wordChunk.trim()) currentChunk = wordChunk;
            } else {
              currentChunk = sentence;
            }
          } else {
            currentChunk += sentence;
          }
        }
        if (currentChunk.trim()) chunks.push(currentChunk.trim());
        return chunks.length ? chunks : [text.slice(0, 240)];
      };

      const chunks = splitIntoChunks(refText, 240);
      const translatedChunks: string[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        setStatus(`Translating segment ${i + 1}/${chunks.length}...`);

        const response = await fetch("/api/v1/translate", {
          method: "POST",
          headers: getRequestHeaders(),
          body: JSON.stringify({
            text: chunk,
            sourceLang: "eng_Latn",
            targetLang,
          }),
        });

        const transJson = await response.json();
        if (!response.ok) {
          throw new Error(transJson?.message || "Translation failed");
        }

        const generated = transJson.translatedText || transJson.result || transJson.translation || "";
        if (generated) {
          translatedChunks.push(generated);
        }
      }

      if (translatedChunks.length) {
        setDraftContent(translatedChunks.join(" "));
        setStatus("AI translation drafted!");
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Translation assist error");
    } finally {
      setTranslating(false);
    }
  };

  // Save changes
  const save = async () => {
    const bookUuid = book.data?.uuid || id;
    if (!bookUuid) return;

    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/v1/pages/${bookUuid}/${activePageNumber}`, {
        method: "PUT",
        headers: getRequestHeaders(),
        body: JSON.stringify({
          content: draftContent,
          language: targetLang,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Unable to save page");
      }

      setStatus("Saved successfully!");
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save page");
    } finally {
      setSaving(false);
    }
  };

  // Touch Swipe Handlers for Mobile (Left: Ref -> Edit, Right: Edit -> Ref)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left -> Switch to Edit
        setMobileTab("edit");
      } else {
        // Swiped right -> Switch to Ref
        setMobileTab("ref");
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full flex flex-col justify-between bg-secondary/30 px-2 sm:px-4">
      {/* Top Header & Mobile Tab Switcher */}
      <div className="py-2 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div className="w-full sm:w-auto flex items-center justify-between">
          <Link
            href="/workspace"
            className="bg-card text-foreground hover:bg-muted border border-border text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={13} />
            <span>Catalog</span>
          </Link>
          <div className="text-xs text-muted-foreground font-semibold sm:hidden">
            Studio ({mobileTab === "ref" ? "Reference" : "Editor"})
          </div>
        </div>

        {/* Mobile Segmented Switcher (< md) */}
        <div className="flex md:hidden w-full items-center justify-center p-1 rounded-xl bg-card border border-border">
          <button
            onClick={() => setMobileTab("ref")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mobileTab === "ref"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen size={13} />
            <span>Reference View</span>
          </button>
          <button
            onClick={() => setMobileTab("edit")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mobileTab === "edit"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 size={13} />
            <span>Translation Editor</span>
          </button>
        </div>

        <div className="text-xs text-muted-foreground font-semibold hidden sm:block">
          Translation Studio
        </div>
      </div>

      {/* Swipeable / Side-by-Side container area */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full flex-1 flex flex-col md:flex-row min-h-0 mb-4 gap-4"
      >
        {/* Reference Column */}
        <div className={`w-full md:flex-1 h-full min-h-0 ${mobileTab === "ref" ? "flex flex-col" : "hidden md:flex md:flex-col"}`}>
          <OuterContainer id={id} type="ref">
            {""}
          </OuterContainer>
        </div>

        {/* Editor Column */}
        <div className={`w-full md:flex-1 h-full min-h-0 ${mobileTab === "edit" ? "flex flex-col" : "hidden md:flex md:flex-col"}`}>
          <OuterContainer id={id} type="edit" onSave={save}>
            <WorkspaceEditor
              targetLang={targetLang}
              setTargetLang={setTargetLang}
              draftContent={draftContent}
              setDraftContent={setDraftContent}
              handleAIAssist={handleAIAssist}
              translating={translating}
              status={status}
            />
          </OuterContainer>
        </div>
      </div>

      <PageList className="rounded-t-xl" />
    </div>
  );
}

const Workspace = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <ReadProvider id={id}>
      <WorkspaceContainer id={id} />
    </ReadProvider>
  );
};

export default Workspace;
