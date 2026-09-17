/**
 * IndicTrans AI Translation API & PDF Intelligence Service Adapter
 * Interacts with AI4Bharat IndicTrans2 Neural Translation and PDF Intelligence Engine.
 */

export const FLORES_LANGUAGE_MAP: Record<string, { code: string; name: string; script: string }> = {
  en: { code: "eng_Latn", name: "English", script: "Latin" },
  eng: { code: "eng_Latn", name: "English", script: "Latin" },
  english: { code: "eng_Latn", name: "English", script: "Latin" },
  eng_Latn: { code: "eng_Latn", name: "English", script: "Latin" },

  hi: { code: "hin_Deva", name: "Hindi", script: "Devanagari" },
  hin: { code: "hin_Deva", name: "Hindi", script: "Devanagari" },
  hindi: { code: "hin_Deva", name: "Hindi", script: "Devanagari" },
  hin_Deva: { code: "hin_Deva", name: "Hindi", script: "Devanagari" },

  mr: { code: "mar_Deva", name: "Marathi", script: "Devanagari" },
  mar: { code: "mar_Deva", name: "Marathi", script: "Devanagari" },
  marathi: { code: "mar_Deva", name: "Marathi", script: "Devanagari" },
  mar_Deva: { code: "mar_Deva", name: "Marathi", script: "Devanagari" },

  ta: { code: "tam_Taml", name: "Tamil", script: "Tamil" },
  tam: { code: "tam_Taml", name: "Tamil", script: "Tamil" },
  tamil: { code: "tam_Taml", name: "Tamil", script: "Tamil" },
  tam_Taml: { code: "tam_Taml", name: "Tamil", script: "Tamil" },

  te: { code: "tel_Telu", name: "Telugu", script: "Telugu" },
  tel: { code: "tel_Telu", name: "Telugu", script: "Telugu" },
  telugu: { code: "tel_Telu", name: "Telugu", script: "Telugu" },
  tel_Telu: { code: "tel_Telu", name: "Telugu", script: "Telugu" },

  gu: { code: "guj_Gujr", name: "Gujarati", script: "Gujarati" },
  guj: { code: "guj_Gujr", name: "Gujarati", script: "Gujarati" },
  gujarati: { code: "guj_Gujr", name: "Gujarati", script: "Gujarati" },
  guj_Gujr: { code: "guj_Gujr", name: "Gujarati", script: "Gujarati" },

  bn: { code: "ben_Beng", name: "Bengali", script: "Bengali" },
  ben: { code: "ben_Beng", name: "Bengali", script: "Bengali" },
  bengali: { code: "ben_Beng", name: "Bengali", script: "Bengali" },
  ben_Beng: { code: "ben_Beng", name: "Bengali", script: "Bengali" },

  kn: { code: "kan_Knda", name: "Kannada", script: "Kannada" },
  kan: { code: "kan_Knda", name: "Kannada", script: "Kannada" },
  kannada: { code: "kan_Knda", name: "Kannada", script: "Kannada" },
  kan_Knda: { code: "kan_Knda", name: "Kannada", script: "Kannada" },

  ml: { code: "mal_Mlym", name: "Malayalam", script: "Malayalam" },
  mal: { code: "mal_Mlym", name: "Malayalam", script: "Malayalam" },
  malayalam: { code: "mal_Mlym", name: "Malayalam", script: "Malayalam" },
  mal_Mlym: { code: "mal_Mlym", name: "Malayalam", script: "Malayalam" },

  pa: { code: "pan_Guru", name: "Punjabi", script: "Gurmukhi" },
  pan: { code: "pan_Guru", name: "Punjabi", script: "Gurmukhi" },
  punjabi: { code: "pan_Guru", name: "Punjabi", script: "Gurmukhi" },
  pan_Guru: { code: "pan_Guru", name: "Punjabi", script: "Gurmukhi" },

  or: { code: "ory_Orya", name: "Odia", script: "Odia" },
  ory: { code: "ory_Orya", name: "Odia", script: "Odia" },
  odia: { code: "ory_Orya", name: "Odia", script: "Odia" },
  ory_Orya: { code: "ory_Orya", name: "Odia", script: "Odia" },

  ur: { code: "urd_Arab", name: "Urdu", script: "Perso-Arabic" },
  urd: { code: "urd_Arab", name: "Urdu", script: "Perso-Arabic" },
  urdu: { code: "urd_Arab", name: "Urdu", script: "Perso-Arabic" },
  urd_Arab: { code: "urd_Arab", name: "Urdu", script: "Perso-Arabic" },

  as: { code: "asm_Beng", name: "Assamese", script: "Bengali" },
  asm: { code: "asm_Beng", name: "Assamese", script: "Bengali" },
  assamese: { code: "asm_Beng", name: "Assamese", script: "Bengali" },
  asm_Beng: { code: "asm_Beng", name: "Assamese", script: "Bengali" },

  sa: { code: "san_Deva", name: "Sanskrit", script: "Devanagari" },
  san: { code: "san_Deva", name: "Sanskrit", script: "Devanagari" },
  sanskrit: { code: "san_Deva", name: "Sanskrit", script: "Devanagari" },
  san_Deva: { code: "san_Deva", name: "Sanskrit", script: "Devanagari" },

  ne: { code: "npi_Deva", name: "Nepali", script: "Devanagari" },
  npi: { code: "npi_Deva", name: "Nepali", script: "Devanagari" },
  nepali: { code: "npi_Deva", name: "Nepali", script: "Devanagari" },
  npi_Deva: { code: "npi_Deva", name: "Nepali", script: "Devanagari" },

  mai: { code: "mai_Deva", name: "Maithili", script: "Devanagari" },
  maithili: { code: "mai_Deva", name: "Maithili", script: "Devanagari" },
  mai_Deva: { code: "mai_Deva", name: "Maithili", script: "Devanagari" },

  bho: { code: "bho_Deva", name: "Bhojpuri", script: "Devanagari" },
  bhojpuri: { code: "bho_Deva", name: "Bhojpuri", script: "Devanagari" },
  bho_Deva: { code: "bho_Deva", name: "Bhojpuri", script: "Devanagari" },
};

export function toFloresCode(inputLang?: string, defaultCode = "hin_Deva"): string {
  if (!inputLang) return defaultCode;
  const cleaned = inputLang.trim().toLowerCase();
  if (FLORES_LANGUAGE_MAP[cleaned]) {
    return FLORES_LANGUAGE_MAP[cleaned].code;
  }
  // If already matches flores format e.g. xxx_Xxxx
  if (/^[a-z]{3}_[A-Za-z]{4}$/.test(inputLang)) {
    return inputLang;
  }
  return defaultCode;
}

export function isEnglishLanguage(lang?: string): boolean {
  if (!lang) return true;
  const cleaned = lang.trim().toLowerCase();
  if (["en", "eng", "english", "eng_latn"].includes(cleaned)) return true;
  const flores = toFloresCode(lang, "");
  return flores === "eng_Latn";
}

export function resolveIndicTransImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const baseUrl = (
    process.env.NEXT_PUBLIC_INDIC_TRANS_API_URL ||
    process.env.INDIC_TRANS_API_URL ||
    process.env.TRANSLATION_API_URL ||
    process.env.TRANSLATION_SERVICE_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/+$/, "");

  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
}


export class IndicTransClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = (
      process.env.INDIC_TRANS_API_URL ||
      process.env.TRANSLATION_API_URL ||
      process.env.TRANSLATION_SERVICE_URL ||
      "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    this.apiKey = process.env.INDIC_TRANS_API_KEY || process.env.TRANSLATION_API_KEY || "sk_live_default_key";
  }

  private getHeaders(isJson = true): Record<string, string> {
    const headers: Record<string, string> = {
      "X-API-KEY": this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
    };
    if (isJson) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  }

  // Raw text translation
  async rawTranslate(text: string, sourceLang = "en", targetLang = "hi") {
    const srcFlores = toFloresCode(sourceLang, "eng_Latn");
    const tgtFlores = toFloresCode(targetLang, "hin_Deva");

    const endpoint = `${this.baseUrl}/api/translate/raw/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({
        text,
        source_lang: srcFlores,
        target_lang: tgtFlores,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(
        errJson?.error?.message ||
        errJson?.message ||
        `IndicTrans error HTTP ${response.status}`
      );
    }

    const data = await response.json();
    return {
      translatedText: data?.data?.translated_text || data?.translated_text || text,
      tokensUsed: data?.data?.tokens_used ?? 0,
      remainingBalance: data?.data?.remaining_balance,
      sourceLang: srcFlores,
      targetLang: tgtFlores,
    };
  }

  // Upload PDF document
  async uploadPdf(formData: FormData) {
    const endpoint = `${this.baseUrl}/api/pdf/upload/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-API-KEY": this.apiKey,
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `PDF upload failed HTTP ${response.status}`);
    }
    return data;
  }

  // List all uploaded PDF documents
  async getDocuments() {
    const endpoint = `${this.baseUrl}/api/pdf/documents/`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `Failed to fetch documents`);
    }
    return data;
  }

  // Extract page (Manual mode)
  async extractPage(docId: string | number, pageNumber?: number) {
    const endpoint = `${this.baseUrl}/api/pdf/${docId}/extract-page/`;
    const body: Record<string, unknown> = {};
    if (typeof pageNumber === "number") {
      body.page_number = pageNumber;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `Failed to extract page`);
    }
    return data;
  }

  // Get extracted pages
  async getPages(docId: string | number, queryParams: { page?: number; start?: number; end?: number; all?: boolean } = {}) {
    const params = new URLSearchParams();
    if (queryParams.all) params.set("all", "true");
    if (queryParams.page) params.set("page", String(queryParams.page));
    if (queryParams.start) params.set("start", String(queryParams.start));
    if (queryParams.end) params.set("end", String(queryParams.end));

    const endpoint = `${this.baseUrl}/api/pdf/${docId}/pages/${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `Failed to fetch pages`);
    }
    return data;
  }

  // Get extracted images
  async getImages(docId: string | number, pageNumber?: number) {
    const params = new URLSearchParams();
    if (pageNumber) params.set("page", String(pageNumber));

    const endpoint = `${this.baseUrl}/api/pdf/${docId}/images/${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `Failed to fetch images`);
    }
    return data;
  }

  // Translate single PDF page
  async translatePage(docId: string | number, pageNumber: number, targetLang: string, sourceLang = "eng_Latn") {
    const srcFlores = toFloresCode(sourceLang, "eng_Latn");
    const tgtFlores = toFloresCode(targetLang, "hin_Deva");

    const endpoint = `${this.baseUrl}/api/pdf/${docId}/translate-page/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({
        page_number: pageNumber,
        source_lang: srcFlores,
        target_lang: tgtFlores,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `Failed to translate page`);
    }
    return data;
  }

  // Translate all PDF pages (Batch)
  async translateAll(docId: string | number, targetLang: string, sourceLang = "eng_Latn") {
    const srcFlores = toFloresCode(sourceLang, "eng_Latn");
    const tgtFlores = toFloresCode(targetLang, "hin_Deva");

    const endpoint = `${this.baseUrl}/api/pdf/${docId}/translate-all/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({
        source_lang: srcFlores,
        target_lang: tgtFlores,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `Failed to batch translate document`);
    }
    return data;
  }

  // Translate range of PDF pages
  async translateRange(docId: string | number, startPage: number, endPage: number, targetLang: string, sourceLang = "eng_Latn") {
    const srcFlores = toFloresCode(sourceLang, "eng_Latn");
    const tgtFlores = toFloresCode(targetLang, "hin_Deva");

    const endpoint = `${this.baseUrl}/api/pdf/${docId}/translate-range/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({
        start_page: startPage,
        end_page: endPage,
        source_lang: srcFlores,
        target_lang: tgtFlores,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `Failed to translate range`);
    }
    return data;
  }

  // Get translations for document
  async getTranslations(docId: string | number, lang: string, all = true, page?: number) {
    const tgtFlores = toFloresCode(lang, "hin_Deva");
    const params = new URLSearchParams();
    params.set("lang", tgtFlores);
    if (all) params.set("all", "true");
    if (page) params.set("page", String(page));

    const endpoint = `${this.baseUrl}/api/pdf/${docId}/translations/?${params.toString()}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `Failed to get translations`);
    }
    return data;
  }

  // Get Tenant Stats
  async getStats() {
    const endpoint = `${this.baseUrl}/api/dashboard/stats/`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      // Fallback to /api/tenant/me/ if stats not available
      const meEndpoint = `${this.baseUrl}/api/tenant/me/`;
      const meRes = await fetch(meEndpoint, {
        method: "GET",
        headers: this.getHeaders(true),
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        return { success: true, data: { tenant: meData.data, tokens: { balance: meData.data.token_balance } } };
      }
      throw new Error(data?.error?.message || data?.message || `Failed to get tenant stats`);
    }
    return data;
  }

  // Top-up tokens (+5,000,000 via Dummy Payment Adapter)
  async topupTokens() {
    // 1. Initiate checkout
    const checkoutRes = await fetch(`${this.baseUrl}/api/payment/checkout/`, {
      method: "POST",
      headers: this.getHeaders(true),
    });
    const checkoutData = await checkoutRes.json().catch(() => null);
    if (!checkoutRes.ok) {
      throw new Error(checkoutData?.error?.message || checkoutData?.message || "Checkout failed");
    }

    const orderId = checkoutData?.data?.order_id;
    if (!orderId) throw new Error("No order ID returned from payment checkout");

    // 2. Confirm order
    const confirmRes = await fetch(`${this.baseUrl}/api/payment/confirm/`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({
        order_id: orderId,
        transaction_id: `TXN-${Date.now()}`,
      }),
    });
    const confirmData = await confirmRes.json().catch(() => null);
    if (!confirmRes.ok) {
      throw new Error(confirmData?.error?.message || confirmData?.message || "Payment confirmation failed");
    }
    return confirmData;
  }
}

export const indicTransClient = new IndicTransClient();

export default indicTransClient;
