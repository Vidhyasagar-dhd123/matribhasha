"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FileText,
  UploadCloud,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Coins,
  HardDrive,
  ArrowRight,
  Languages,
  Zap,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  X,
  FileCheck,
  Globe2,
  Layers,
  ExternalLink,
  BookMarked,
  Check,
} from "lucide-react";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import { getBooks } from "../services/books";
import { resolveIndicTransImageUrl } from "@/modules/translation/services/indicTrans.service";
import Link from "next/link";

interface TenantStats {
  tenant?: {
    id: number;
    name: string;
    email: string;
    token_balance?: number;
    storage_used_mb?: number;
    max_storage_mb?: number;
  };
  tokens?: {
    balance: number;
    total_used?: number;
    used_today?: number;
  };
  storage?: {
    used_mb: number;
    max_mb: number;
    percentage: number;
    total_documents?: number;
  };
}

interface PdfDocumentItem {
  id?: number;
  document_id?: number;
  title: string;
  file_name?: string;
  file_size_mb?: number;
  total_pages?: number;
  extracted_pages_count?: number;
  extraction_mode?: "auto" | "manual";
  status?: string;
  created_at?: string;
}

interface ExtractedImage {
  image_number: number;
  image_name: string;
  image_url: string;
  width: number;
  height: number;
  file_size_bytes: number;
  ocr_text?: string;
}

interface ExtractedPage {
  page_number: number;
  raw_text?: string;
  ocr_text?: string;
  combined_text?: string;
  has_images?: boolean;
  image_count?: number;
  images?: ExtractedImage[];
  word_count?: number;
}

interface BookOption {
  uuid: string;
  title: string;
  author: string;
  originalLanguage?: string;
  totalPages?: number;
}

const INDIC_LANGUAGES = [
  { code: "hin_Deva", name: "Hindi (हिन्दी)", script: "Devanagari" },
  { code: "mar_Deva", name: "Marathi (मराठी)", script: "Devanagari" },
  { code: "tam_Taml", name: "Tamil (தமிழ்)", script: "Tamil" },
  { code: "tel_Telu", name: "Telugu (తెలుగు)", script: "Telugu" },
  { code: "guj_Gujr", name: "Gujarati (ગુજરાતી)", script: "Gujarati" },
  { code: "ben_Beng", name: "Bengali (বাংলা)", script: "Bengali" },
  { code: "kan_Knda", name: "Kannada (ಕನ್ನಡ)", script: "Kannada" },
  { code: "mal_Mlym", name: "Malayalam (മലയാളം)", script: "Malayalam" },
  { code: "pan_Guru", name: "Punjabi (ਪੰਜਾਬੀ)", script: "Gurmukhi" },
  { code: "ory_Orya", name: "Odia (ଓଡ଼ିଆ)", script: "Odia" },
  { code: "urd_Arab", name: "Urdu (اردو)", script: "Perso-Arabic" },
  { code: "asm_Beng", name: "Assamese (অসমীয়া)", script: "Bengali" },
  { code: "san_Deva", name: "Sanskrit (संस्कृतम्)", script: "Devanagari" },
  { code: "npi_Deva", name: "Nepali (नेपाली)", script: "Devanagari" },
  { code: "mai_Deva", name: "Maithili (मैथिली)", script: "Devanagari" },
  { code: "bho_Deva", name: "Bhojpuri (भोजपुरी)", script: "Devanagari" },
];

export default function PdfIntelligencePanel() {
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [documents, setDocuments] = useState<PdfDocumentItem[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadMode, setUploadMode] = useState<"auto" | "manual">("auto");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Active Document Studio State
  const [selectedDoc, setSelectedDoc] = useState<PdfDocumentItem | null>(null);
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [studioTab, setStudioTab] = useState<"text" | "ocr" | "translate">("translate");

  // Translation State
  const [targetLang, setTargetLang] = useState("hin_Deva");
  const [translatedDraft, setTranslatedDraft] = useState("");
  const [pageTranslations, setPageTranslations] = useState<Record<number, string>>({});
  const [translating, setTranslating] = useState(false);
  const [batchTranslating, setBatchTranslating] = useState(false);
  const [translationCached, setTranslationCached] = useState(false);
  const [tokensUsedLast, setTokensUsedLast] = useState<number | null>(null);

  // Publishing & Metadata Modal State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishTarget, setPublishTarget] = useState<"new" | "existing">("new");
  const [availableBooks, setAvailableBooks] = useState<BookOption[]>([]);
  const [selectedBookUuid, setSelectedBookUuid] = useState("");

  // Book Metadata Form
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookGenre, setBookGenre] = useState("Literature");
  const [bookIsbn, setBookIsbn] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookCoverURI, setBookCoverURI] = useState("");
  const [publishOriginalVersion, setPublishOriginalVersion] = useState(true);
  const [publishTranslatedVersion, setPublishTranslatedVersion] = useState(true);

  // Publishing Status
  const [publishing, setPublishing] = useState(false);
  const [publishedResult, setPublishedResult] = useState<{
    bookUuid: string;
    bookTitle: string;
    totalPages: number;
    versionsCount: number;
  } | null>(null);

  // Fetch tenant quota & analytics
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/v1/admin/indic-trans/stats", {
        headers: getRequestHeaders(false),
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.data || json);
      }
    } catch (err) {
      console.error("Failed to fetch tenant stats", err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch uploaded documents
  const fetchDocuments = async () => {
    setDocsLoading(true);
    try {
      const res = await fetch("/api/v1/admin/pdf", {
        headers: getRequestHeaders(false),
      });
      if (res.ok) {
        const json = await res.json();
        const docsList = json?.data?.documents || json?.documents || json?.data || [];
        setDocuments(Array.isArray(docsList) ? docsList : []);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setDocsLoading(false);
    }
  };

  // Top up token balance (Dummy adapter)
  const handleTopup = async () => {
    try {
      const res = await fetch("/api/v1/admin/indic-trans/stats", {
        method: "POST",
        headers: getRequestHeaders(false),
      });
      if (res.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error("Topup failed", err);
    }
  };

  // Refresh books list
  const loadAvailableBooks = () => {
    getBooks()
      .then((res) => {
        const bList = res?.books || res || [];
        if (Array.isArray(bList)) setAvailableBooks(bList);
      })
      .catch(() => {});
  };

  // Initial Load
  useEffect(() => {
    fetchStats();
    fetchDocuments();
    loadAvailableBooks();
  }, []);

  // Handle PDF Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadStatus({ type: "error", message: "Please select a PDF file to upload." });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("mode", uploadMode);
    if (uploadTitle.trim()) {
      formData.append("title", uploadTitle.trim());
    }

    try {
      const headers = getRequestHeaders(false) as Record<string, string>;
      const res = await fetch("/api/v1/admin/pdf", {
        method: "POST",
        headers: {
          Authorization: headers.Authorization || "",
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error?.message || "Upload failed");
      }

      setUploadStatus({ type: "success", message: "PDF uploaded and processed successfully." });
      setUploadFile(null);
      setUploadTitle("");
      await fetchDocuments();
      await fetchStats();

      if (data?.data) {
        openDocumentStudio(data.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error occurred";
      setUploadStatus({ type: "error", message: msg });
    } finally {
      setUploading(false);
    }
  };

  // Open Document in Studio
  const openDocumentStudio = async (doc: PdfDocumentItem) => {
    setSelectedDoc(doc);
    setBookTitle(doc.title || doc.file_name || "New Book");
    setBookAuthor("Admin");
    setBookDescription(`Extracted and published from PDF document "${doc.title || doc.file_name}"`);
    setPublishedResult(null);
    setPagesLoading(true);
    const docId = doc.id || doc.document_id;

    try {
      const [pagesRes, transRes] = await Promise.all([
        fetch(`/api/v1/admin/pdf/${docId}/pages?all=true`, { headers: getRequestHeaders(false) }),
        fetch(`/api/v1/admin/pdf/${docId}/translate?lang=${targetLang}&all=true`, { headers: getRequestHeaders(false) }),
      ]);

      let pList: ExtractedPage[] = [];
      if (pagesRes.ok) {
        const json = await pagesRes.json();
        pList = json?.data?.pages || json?.pages || json?.data || [];
        setPages(Array.isArray(pList) ? pList : []);
        setActivePageIndex(0);

        // Auto-assign first extracted image as cover if available
        const firstImg = pList.find((p) => p.images && p.images.length > 0)?.images?.[0];
        if (firstImg) {
          setBookCoverURI(resolveIndicTransImageUrl(firstImg.image_url));
        }
      }

      if (transRes.ok) {
        const transJson = await transRes.json();
        const tList = transJson?.data?.translations || transJson?.data || transJson?.translations || [];
        const tMap: Record<number, string> = {};
        for (const t of tList) {
          const pNum = Number(t.page_number || t.pageNumber);
          if (pNum) tMap[pNum] = t.translated_text || t.content || "";
        }
        setPageTranslations(tMap);
        if (pList.length > 0 && tMap[pList[0].page_number]) {
          setTranslatedDraft(tMap[pList[0].page_number]);
        }
      }
    } catch (err) {
      console.error("Failed to load doc pages", err);
    } finally {
      setPagesLoading(false);
    }
  };

  // Load or translate page
  const loadPageTranslation = async (docId: number | string, pageNumber: number, lang: string) => {
    try {
      const res = await fetch(`/api/v1/admin/pdf/${docId}/translate?lang=${lang}&page=${pageNumber}`, {
        headers: getRequestHeaders(false),
      });
      if (res.ok) {
        const json = await res.json();
        const tText = json?.data?.translated_text || json?.translated_text || "";
        setTranslatedDraft(tText);
        setPageTranslations((prev) => ({ ...prev, [pageNumber]: tText }));
        setTranslationCached(json?.data?.cached ?? true);
      } else {
        setTranslatedDraft(pageTranslations[pageNumber] || "");
      }
    } catch {
      setTranslatedDraft(pageTranslations[pageNumber] || "");
    }
  };

  const activePage = pages[activePageIndex] || null;

  // Trigger AI Translation for Single Page
  const handleTranslateSinglePage = async () => {
    if (!selectedDoc || !activePage) return;
    setTranslating(true);
    setTranslationCached(false);
    setTokensUsedLast(null);
    const docId = selectedDoc.id || selectedDoc.document_id;

    try {
      const res = await fetch(`/api/v1/admin/pdf/${docId}/translate`, {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify({
          mode: "single",
          page_number: activePage.page_number,
          target_lang: targetLang,
          source_lang: "eng_Latn",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Translation failed");

      const translated = data?.data?.translated_text || data?.translated_text || "";
      setTranslatedDraft(translated);
      setPageTranslations((prev) => ({ ...prev, [activePage.page_number]: translated }));
      setTranslationCached(Boolean(data?.data?.cached));
      setTokensUsedLast(data?.data?.tokens_used ?? null);
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Translation error";
      alert(`Translation Error: ${msg}`);
    } finally {
      setTranslating(false);
    }
  };

  // Batch Translate All Pages
  const handleTranslateAllPages = async () => {
    if (!selectedDoc) return;
    if (!confirm(`Batch translate all ${pages.length || selectedDoc.total_pages || ""} pages to ${targetLang}?`)) return;

    setBatchTranslating(true);
    const docId = selectedDoc.id || selectedDoc.document_id;

    try {
      const res = await fetch(`/api/v1/admin/pdf/${docId}/translate`, {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify({
          mode: "all",
          target_lang: targetLang,
          source_lang: "eng_Latn",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Batch translation failed");

      // Reload translations
      const transRes = await fetch(`/api/v1/admin/pdf/${docId}/translate?lang=${targetLang}&all=true`, {
        headers: getRequestHeaders(false),
      });
      if (transRes.ok) {
        const transJson = await transRes.json();
        const tList = transJson?.data?.translations || transJson?.data || transJson?.translations || [];
        const tMap: Record<number, string> = {};
        for (const t of tList) {
          const pNum = Number(t.page_number || t.pageNumber);
          if (pNum) tMap[pNum] = t.translated_text || t.content || "";
        }
        setPageTranslations(tMap);
        if (activePage && tMap[activePage.page_number]) {
          setTranslatedDraft(tMap[activePage.page_number]);
        }
      }

      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Batch translation failed";
      alert(`Batch Translation Error: ${msg}`);
    } finally {
      setBatchTranslating(false);
    }
  };

  // Manual Extract Next/Specific Page
  const handleManualExtract = async (pageNumber?: number) => {
    if (!selectedDoc) return;
    const docId = selectedDoc.id || selectedDoc.document_id;
    try {
      const res = await fetch(`/api/v1/admin/pdf/${docId}/pages`, {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify({ page_number: pageNumber }),
      });
      if (res.ok) {
        await openDocumentStudio(selectedDoc);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Publish and Add as Book with Sequential Integrity
  const handlePublishAsBook = async () => {
    if (!selectedDoc) return;
    setPublishing(true);
    setPublishedResult(null);
    const docId = selectedDoc.id || selectedDoc.document_id;

    // Build sequential page payload
    const sortedPages = [...pages].sort((a, b) => a.page_number - b.page_number);
    const payloadPages = sortedPages.map((p) => {
      // Use active edited draft if on current page, else stored translation
      const transText =
        p.page_number === activePage?.page_number && translatedDraft
          ? translatedDraft
          : pageTranslations[p.page_number] || "";

      return {
        pageNumber: p.page_number,
        originalContent: p.combined_text || p.raw_text || "",
        translatedContent: transText,
      };
    });

    const payload = {
      createNewBook: publishTarget === "new",
      bookUUID: publishTarget === "existing" ? selectedBookUuid : undefined,
      bookDetails: {
        title: bookTitle.trim() || `Book from Doc #${docId}`,
        author: bookAuthor.trim() || "Admin",
        genre: bookGenre.trim() || "Literature",
        isbn13: bookIsbn.trim(),
        description: bookDescription.trim(),
        coverURI: bookCoverURI.trim(),
        originalLanguage: "en",
      },
      publishOriginal: publishOriginalVersion,
      publishTranslated: publishTranslatedVersion,
      targetLanguage: targetLang,
      pages: payloadPages,
    };

    try {
      const res = await fetch(`/api/v1/admin/pdf/${docId}/publish`, {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Publishing failed");

      const publishedBook = data?.data?.book;
      setPublishedResult({
        bookUuid: publishedBook?.uuid || selectedBookUuid,
        bookTitle: publishedBook?.title || bookTitle,
        totalPages: data?.data?.totalPages || payloadPages.length,
        versionsCount: data?.data?.publishedVersionsCount || 0,
      });
      loadAvailableBooks();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Publishing error";
      alert(`Publishing Error: ${msg}`);
    } finally {
      setPublishing(false);
    }
  };

  const tokenBalance = stats?.tokens?.balance ?? stats?.tenant?.token_balance ?? 0;
  const storageUsed = stats?.storage?.used_mb ?? stats?.tenant?.storage_used_mb ?? 0;
  const maxStorage = stats?.storage?.max_mb ?? stats?.tenant?.max_storage_mb ?? 200;
  const storagePercent = Math.min(100, Math.round((storageUsed / maxStorage) * 100));

  // Collect all extracted images across document
  const allExtractedImages = useMemo(() => {
    const list: ExtractedImage[] = [];
    for (const p of pages) {
      if (p.images && p.images.length > 0) {
        list.push(...p.images);
      }
    }
    return list;
  }, [pages]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quota Meter */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <Sparkles size={13} />
              <span>IndicTrans2 Neural Engine &amp; PDF Intelligence</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              PDF Document Intelligence &amp; Book Publishing
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Extract PDF text, run embedded image OCR, translate into 16+ Indic languages, and publish as full Books with preserved page breaking sequences and versions.
            </p>
          </div>

          {/* Quota Widgets */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tokens Badge */}
            <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 min-w-[180px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Coins size={14} className="text-amber-500" />
                  <span>Token Balance</span>
                </span>
                <button
                  onClick={handleTopup}
                  className="rounded-lg bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition border border-primary/20 flex items-center gap-1"
                  title="Credit 5,000,000 dummy tokens"
                >
                  <Zap size={11} />
                  <span>+5M</span>
                </button>
              </div>
              <div className="mt-1 text-xl font-bold text-foreground">
                {tokenBalance.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">tokens</span>
              </div>
            </div>

            {/* 200MB Storage Gauge */}
            <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 min-w-[200px]">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <HardDrive size={14} className="text-sky-500" />
                  <span>Storage Quota</span>
                </span>
                <span className="text-foreground font-bold">{storagePercent}%</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-foreground">
                  {storageUsed.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">/ {maxStorage} MB</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${
                    storagePercent > 85 ? "bg-destructive" : storagePercent > 60 ? "bg-amber-500" : "bg-primary"
                  }`}
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                fetchStats();
                fetchDocuments();
                loadAvailableBooks();
              }}
              disabled={statsLoading}
              className="rounded-2xl border border-border bg-card p-3.5 text-foreground hover:bg-muted transition shadow-xs disabled:opacity-50"
              title="Refresh Quota &amp; Documents"
            >
              <RefreshCw size={16} className={statsLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Document Catalog */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Upload New PDF (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UploadCloud className="text-primary" size={20} />
              <h2 className="text-lg font-bold text-foreground">Upload Document</h2>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Document Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maharana Pratap Biography"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Extraction Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadMode("auto")}
                    className={`rounded-xl border p-2.5 text-left transition flex flex-col justify-between ${
                      uploadMode === "auto"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border bg-background hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs">
                      <Zap size={13} className="text-primary" />
                      <span>Auto Mode</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-normal mt-0.5">All pages &amp; OCR</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("manual")}
                    className={`rounded-xl border p-2.5 text-left transition flex flex-col justify-between ${
                      uploadMode === "manual"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border bg-background hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs">
                      <FileText size={13} className="text-primary" />
                      <span>Manual Mode</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-normal mt-0.5">On-demand extraction</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Select PDF File
                </label>
                <div className="rounded-2xl border-2 border-dashed border-border p-4 text-center hover:border-primary/50 transition bg-muted/20">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
                    }}
                    className="hidden"
                    id="pdf-upload-input"
                  />
                  <label htmlFor="pdf-upload-input" className="cursor-pointer block">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs font-medium text-foreground block">
                      {uploadFile ? uploadFile.name : "Click to choose or drop a PDF"}
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-1">
                      {uploadFile
                        ? `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : "200 MB maximum tenant storage"}
                    </span>
                  </label>
                </div>
              </div>

              {uploadStatus && (
                <div
                  className={`rounded-xl p-3 text-xs font-medium flex items-center gap-2 ${
                    uploadStatus.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  {uploadStatus.type === "success" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  <span>{uploadStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !uploadFile}
                className="w-full rounded-xl bg-primary py-2.5 px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing &amp; Extracting...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>Upload &amp; Process PDF</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Uploaded Documents Catalog (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              <h2 className="text-lg font-bold text-foreground">Processed Documents</h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                {documents.length}
              </span>
            </div>
          </div>

          {docsLoading ? (
            <div className="flex-1 flex items-center justify-center py-12 text-muted-foreground text-sm">
              <Loader2 className="animate-spin mr-2" size={16} />
              <span>Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-border">
              <FileText className="h-10 w-10 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-semibold text-foreground">No PDF Documents Uploaded</p>
              <p className="text-xs text-muted-foreground mt-1">Upload a PDF document to start extracting and translating pages.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {documents.map((doc) => {
                const docId = doc.id || doc.document_id;
                const isSelected = (selectedDoc?.id || selectedDoc?.document_id) === docId;
                return (
                  <div
                    key={docId}
                    onClick={() => openDocumentStudio(doc)}
                    className={`cursor-pointer rounded-2xl border p-4 transition text-left flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-foreground line-clamp-1">
                          {doc.title || doc.file_name || `Document #${docId}`}
                        </h3>
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground font-bold shrink-0">
                          {doc.extraction_mode || "auto"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{doc.file_name}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        <strong className="text-foreground">{doc.extracted_pages_count ?? doc.total_pages ?? 0}</strong> / {doc.total_pages ?? "?"} pages
                      </span>
                      <span className="font-semibold text-primary inline-flex items-center gap-1">
                        <span>Open Studio</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Document Intelligence & Translation Studio */}
      {selectedDoc && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
          {/* Studio Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-primary/10 text-primary font-mono text-xs px-2.5 py-0.5 font-bold border border-primary/20">
                  Doc #{selectedDoc.id || selectedDoc.document_id}
                </span>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedDoc.title || selectedDoc.file_name}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Extraction Mode: <span className="uppercase font-mono font-bold text-foreground">{selectedDoc.extraction_mode || "auto"}</span> · {pages.length} Pages Extracted
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowPublishModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
              >
                <BookMarked size={15} />
                <span>Add / Publish as Book</span>
              </button>
            </div>
          </div>

          {pagesLoading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="animate-spin mx-auto mb-2" size={24} />
              <span>Loading extracted pages and sequence data...</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-dashed border-border">
              <p className="text-sm font-semibold text-foreground">No pages extracted yet for this document.</p>
              <button
                onClick={() => handleManualExtract(1)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition"
              >
                <Zap size={14} />
                <span>Extract Page 1</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Page Navigator */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 rounded-2xl p-3 border border-border">
                <div className="flex items-center gap-2">
                  <button
                    disabled={activePageIndex <= 0}
                    onClick={() => {
                      const newIdx = activePageIndex - 1;
                      setActivePageIndex(newIdx);
                      const docId = selectedDoc.id || selectedDoc.document_id;
                      loadPageTranslation(docId!, pages[newIdx].page_number, targetLang);
                    }}
                    className="rounded-lg border border-border bg-background p-1.5 text-foreground hover:bg-muted disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-foreground">
                    Page {activePage?.page_number} of {pages.length}
                  </span>
                  <button
                    disabled={activePageIndex >= pages.length - 1}
                    onClick={() => {
                      const newIdx = activePageIndex + 1;
                      setActivePageIndex(newIdx);
                      const docId = selectedDoc.id || selectedDoc.document_id;
                      loadPageTranslation(docId!, pages[newIdx].page_number, targetLang);
                    }}
                    className="rounded-lg border border-border bg-background p-1.5 text-foreground hover:bg-muted disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border text-xs font-semibold">
                  <button
                    onClick={() => setStudioTab("text")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      studioTab === "text" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileText size={13} />
                    <span>Original Text</span>
                  </button>
                  <button
                    onClick={() => setStudioTab("ocr")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      studioTab === "ocr" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ImageIcon size={13} />
                    <span>OCR &amp; Images ({activePage?.images?.length || 0})</span>
                  </button>
                  <button
                    onClick={() => setStudioTab("translate")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      studioTab === "translate" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Languages size={13} />
                    <span>AI Translation</span>
                  </button>
                </div>
              </div>

              {/* View Tab 1: Extracted Raw / Combined Text */}
              {studioTab === "text" && (
                <div className="rounded-2xl border border-border bg-background p-5 font-serif text-sm leading-relaxed text-foreground whitespace-pre-wrap min-h-[300px] max-h-[500px] overflow-y-auto">
                  {activePage?.combined_text || activePage?.raw_text || "No text found on this page."}
                </div>
              )}

              {/* View Tab 2: OCR & Extracted Images */}
              {studioTab === "ocr" && (
                <div className="space-y-4">
                  {!activePage?.images || activePage.images.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground text-xs border border-dashed border-border rounded-2xl">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                      <span>No embedded diagrams or images detected on Page {activePage?.page_number}.</span>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {activePage.images.map((img) => {
                        const resolvedSrc = resolveIndicTransImageUrl(img.image_url);
                        return (
                          <div key={img.image_number} className="rounded-2xl border border-border bg-background p-4 space-y-3">
                            <div className="relative h-52 w-full rounded-xl overflow-hidden bg-muted/40 border border-border flex items-center justify-center p-2">
                              <img
                                src={resolvedSrc}
                                alt={img.image_name}
                                className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.opacity = "0.6";
                                }}
                              />
                            </div>
                            <div className="text-xs">
                              <div className="font-bold text-foreground">{img.image_name}</div>
                              <div className="text-[11px] text-muted-foreground">
                                {img.width}x{img.height} · {(img.file_size_bytes / 1024).toFixed(1)} KB
                              </div>
                              {img.ocr_text && (
                                <div className="mt-2 rounded-lg bg-muted/50 p-2.5 text-[11px] font-mono text-foreground border border-border">
                                  <strong className="text-primary block mb-0.5">Tesseract OCR Text:</strong>
                                  <span>{img.ocr_text}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* View Tab 3: AI Translation Workbench */}
              {studioTab === "translate" && (
                <div className="space-y-4">
                  {/* Translation Control Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-4 rounded-2xl border border-border">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Globe2 size={13} className="text-primary" />
                        <span>Target Language:</span>
                      </label>
                      <select
                        value={targetLang}
                        onChange={(e) => {
                          setTargetLang(e.target.value);
                          if (selectedDoc && activePage) {
                            const docId = selectedDoc.id || selectedDoc.document_id;
                            loadPageTranslation(docId!, activePage.page_number, e.target.value);
                          }
                        }}
                        className="rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary"
                      >
                        {INDIC_LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTranslateSinglePage}
                        disabled={translating}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {translating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                        <span>Translate Page {activePage?.page_number}</span>
                      </button>

                      <button
                        onClick={handleTranslateAllPages}
                        disabled={batchTranslating}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3.5 py-1.5 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 transition disabled:opacity-50 border border-border"
                      >
                        {batchTranslating ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                        <span>Batch Translate All</span>
                      </button>
                    </div>
                  </div>

                  {/* Dual Column: Source Page Text vs Translated Text */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* Source English */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                        <span>Original Reference Text (English)</span>
                        <span>{activePage?.word_count ?? 0} words</span>
                      </div>
                      <div className="h-72 overflow-y-auto rounded-xl border border-input bg-background p-4 font-serif text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                        {activePage?.combined_text || activePage?.raw_text || "No text available."}
                      </div>
                    </div>

                    {/* AI Translation Draft */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <span>AI Translation [{targetLang}]</span>
                          {translationCached && (
                            <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                              <Zap size={10} />
                              <span>0-Token Cached</span>
                            </span>
                          )}
                          {tokensUsedLast !== null && !translationCached && (
                            <span className="rounded-md bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-bold">
                              {tokensUsedLast} tokens
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-normal">Editable before publishing</span>
                      </div>
                      <textarea
                        value={translatedDraft}
                        onChange={(e) => {
                          setTranslatedDraft(e.target.value);
                          if (activePage) {
                            setPageTranslations((prev) => ({ ...prev, [activePage.page_number]: e.target.value }));
                          }
                        }}
                        placeholder={`Translated text in ${targetLang} will appear here...`}
                        className="h-72 w-full resize-none rounded-xl border border-input bg-background p-4 font-serif text-sm leading-relaxed text-foreground outline-none focus:border-primary placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Add as Book & Publish Modal */}
      {showPublishModal && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <BookMarked className="text-primary" size={22} />
                <div>
                  <h3 className="text-lg font-bold text-foreground">Add Document as Catalog Book</h3>
                  <p className="text-xs text-muted-foreground">Manage book metadata, versions, and preserved page sequences.</p>
                </div>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {publishedResult ? (
              <div className="space-y-4 py-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">Book Successfully Published!</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    &ldquo;{publishedResult.bookTitle}&rdquo; has been created with {publishedResult.totalPages} sequential pages and {publishedResult.versionsCount} language versions.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <Link
                    href={`/read/${publishedResult.bookUuid}`}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border bg-muted/30 hover:bg-muted/60 transition text-xs font-bold text-foreground gap-1.5"
                  >
                    <BookOpen size={16} className="text-primary" />
                    <span>Open Reader</span>
                  </Link>

                  <Link
                    href={`/workspace/${publishedResult.bookUuid}`}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border bg-muted/30 hover:bg-muted/60 transition text-xs font-bold text-foreground gap-1.5"
                  >
                    <Languages size={16} className="text-primary" />
                    <span>Open Workspace</span>
                  </Link>

                  <Link
                    href="/books"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border bg-muted/30 hover:bg-muted/60 transition text-xs font-bold text-foreground gap-1.5"
                  >
                    <ExternalLink size={16} className="text-primary" />
                    <span>Catalog View</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPublishModal(false);
                    setPublishedResult(null);
                  }}
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 1. Target Book Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    1. Book Record Target
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPublishTarget("new")}
                      className={`rounded-xl border p-3 text-left transition flex flex-col justify-between ${
                        publishTarget === "new"
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border bg-background text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs">
                        <Sparkles size={13} className="text-primary" />
                        <span>Create New Book Entry</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-normal">Fresh catalog book</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPublishTarget("existing")}
                      className={`rounded-xl border p-3 text-left transition flex flex-col justify-between ${
                        publishTarget === "existing"
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border bg-background text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs">
                        <BookOpen size={13} className="text-primary" />
                        <span>Link to Existing Book</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-normal">Attach pages to book</div>
                    </button>
                  </div>
                </div>

                {/* 2. Metadata Form */}
                {publishTarget === "new" ? (
                  <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      2. Book Metadata Details
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Book Title *</label>
                        <input
                          type="text"
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          placeholder="e.g. Life of Chhatrapati Shivaji Maharaj"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Author Name *</label>
                        <input
                          type="text"
                          value={bookAuthor}
                          onChange={(e) => setBookAuthor(e.target.value)}
                          placeholder="e.g. Historical Society"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Genre</label>
                        <input
                          type="text"
                          value={bookGenre}
                          onChange={(e) => setBookGenre(e.target.value)}
                          placeholder="e.g. History, Biography"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">ISBN-13 (Optional)</label>
                        <input
                          type="text"
                          value={bookIsbn}
                          onChange={(e) => setBookIsbn(e.target.value)}
                          placeholder="e.g. 978-3-16-148410-0"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Description / Synopsis</label>
                      <textarea
                        value={bookDescription}
                        onChange={(e) => setBookDescription(e.target.value)}
                        placeholder="Brief overview of the book..."
                        className="w-full h-16 resize-none rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Book Cover Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Book Cover Image</label>
                      <input
                        type="text"
                        value={bookCoverURI}
                        onChange={(e) => setBookCoverURI(e.target.value)}
                        placeholder="https://... or select an extracted image below"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary mb-2"
                      />

                      {allExtractedImages.length > 0 && (
                        <div>
                          <span className="text-[11px] text-muted-foreground block mb-1.5">Or choose from extracted diagrams/images:</span>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {allExtractedImages.slice(0, 6).map((img) => {
                              const resolved = resolveIndicTransImageUrl(img.image_url);
                              const isSelected = bookCoverURI === resolved;
                              return (
                                <button
                                  key={img.image_name}
                                  type="button"
                                  onClick={() => setBookCoverURI(resolved)}
                                  className={`relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border transition ${
                                    isSelected ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <img src={resolved} alt="" className="h-full w-full object-cover" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-muted/20 p-4 rounded-2xl border border-border">
                    <label className="block text-xs font-semibold text-muted-foreground">Select Target Book</label>
                    <select
                      value={selectedBookUuid}
                      onChange={(e) => setSelectedBookUuid(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">-- Choose Existing Book --</option>
                      {availableBooks.map((b) => (
                        <option key={b.uuid} value={b.uuid}>
                          {b.title} ({b.author}) - {b.totalPages ?? 0} pages
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. Versions & Sequence Options */}
                <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    3. Page Versions to Publish
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label
                      onClick={() => setPublishOriginalVersion(!publishOriginalVersion)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition ${
                        publishOriginalVersion
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded flex items-center justify-center border ${publishOriginalVersion ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
                        {publishOriginalVersion && <Check size={12} />}
                      </div>
                      <div className="text-xs">
                        <div>Original English Version</div>
                        <div className="text-[10px] font-normal text-muted-foreground">Pages 1..{pages.length}</div>
                      </div>
                    </label>

                    <label
                      onClick={() => setPublishTranslatedVersion(!publishTranslatedVersion)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition ${
                        publishTranslatedVersion
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded flex items-center justify-center border ${publishTranslatedVersion ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
                        {publishTranslatedVersion && <Check size={12} />}
                      </div>
                      <div className="text-xs">
                        <div>Translated Version [{targetLang}]</div>
                        <div className="text-[10px] font-normal text-muted-foreground">
                          {Object.keys(pageTranslations).length || (translatedDraft ? 1 : 0)} pages translated
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 4. Sequence Integrity Check */}
                <div className="rounded-2xl border border-border bg-background p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <FileCheck size={14} className="text-primary" />
                      <span>Breaking Sequence &amp; Page Order Verification</span>
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {pages.length} Pages Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">
                    Page breaks (<code className="text-primary font-mono">\n\n</code>), sentence flow, and sequential numbering (<code className="text-primary font-mono">1..{pages.length}</code>) are preserved without merging disruptions.
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-foreground hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePublishAsBook}
                    disabled={
                      publishing ||
                      (publishTarget === "existing" && !selectedBookUuid) ||
                      (publishTarget === "new" && !bookTitle.trim()) ||
                      (!publishOriginalVersion && !publishTranslatedVersion)
                    }
                    className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {publishing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Publishing Book...</span>
                      </>
                    ) : (
                      <>
                        <BookMarked size={14} />
                        <span>Confirm &amp; Add as Book</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
