import { TranslationFunction } from "./utils";

const localTranslate: TranslationFunction = async (text, srcLang, tgtLang) => {
  const serviceUrl = process.env.TRANSLATION_SERVICE_URL || "http://127.0.0.1:8000/api/translate/";

  try {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        source_lang: srcLang,
        target_lang: tgtLang,
      }),
    });

    if (!response.ok) {
      // Fallback try GET for legacy microservice compatibility if POST fails
      const params = new URLSearchParams({ text });
      if (srcLang) params.append("source_lang", srcLang);
      if (tgtLang) params.append("target_lang", tgtLang);

      const getResponse = await fetch(`${serviceUrl}?${params.toString()}`);
      if (!getResponse.ok) {
        throw new Error(`Translation service error: HTTP ${response.status}`);
      }
      const getData = await getResponse.json();
      return getData.translated_text || getData.translation || text;
    }

    const data = await response.json();
    return data.translated_text || data.translation || data.result || text;
  } catch (err) {
    console.error("Error in local translation:", err);
    throw err;
  }
};

export default localTranslate;