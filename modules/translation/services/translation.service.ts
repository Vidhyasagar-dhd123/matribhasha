import indicTransClient, {
  isEnglishLanguage,
  toFloresCode,
} from "./indicTrans.service";
import { translate } from "./translate.service";

export { isEnglishLanguage };

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
  fallbackVendor = "local"
) {
  try {
    const result = await indicTransClient.rawTranslate(text, sourceLang, targetLang);
    return {
      translatedText: result.translatedText,
      sourceLang: result.sourceLang,
      targetLang: result.targetLang,
      tokensUsed: result.tokensUsed,
      remainingBalance: result.remainingBalance,
    };
  } catch (error) {
    console.warn("IndicTrans translation failed; using configured fallback.", error);
    const translatedText = await translate(text, sourceLang, targetLang, fallbackVendor);

    return {
      translatedText,
      sourceLang: toFloresCode(sourceLang, "eng_Latn"),
      targetLang: toFloresCode(targetLang, "hin_Deva"),
    };
  }
}
