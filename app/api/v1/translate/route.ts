import { translate } from "@/modules/translation/services/translate.service";
import indicTransClient, { isEnglishLanguage, toFloresCode } from "@/modules/translation/services/indicTrans.service";
import authenticateUser, { isAdminUser } from "@/lib/auth";
import { z } from "zod";

const translateSchema = z.object({
  text: z.string().min(1, "Text is required"),
  sourceLang: z.string().optional(),
  srcLang: z.string().optional(),
  targetLang: z.string().optional(),
  tgtLang: z.string().optional(),
  vendor: z.string().optional().default("indicTrans"),
});

export async function POST(request: Request) {
  try {
    const currentUser = await authenticateUser(request);
    const isAdmin = isAdminUser(currentUser);

    const json = await request.json();
    const result = translateSchema.safeParse(json);

    if (!result.success) {
      return Response.json(
        { message: result.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { text, sourceLang, srcLang, targetLang, tgtLang, vendor } = result.data;
    const finalSource = sourceLang || srcLang || "eng_Latn";
    const finalTarget = targetLang || tgtLang || "hin_Deva";

    // Enforce regular user constraints
    if (!isAdmin) {
      // 1. Enforce English source only (English -> Indic languages)
      if (!isEnglishLanguage(finalSource)) {
        return Response.json(
          {
            message: "User translation assistance is restricted to English source only (English -> Indic languages).",
          },
          { status: 400 }
        );
      }

      // 2. Enforce 250 character limit per request
      if (text.trim().length > 250) {
        return Response.json(
          {
            message: `User translation assistance is limited to 250 characters per request (received ${text.trim().length} characters). Please translate in smaller segments.`,
          },
          { status: 400 }
        );
      }
    }

    // Try primary IndicTrans translation
    try {
      const transResult = await indicTransClient.rawTranslate(text, finalSource, finalTarget);
      return Response.json(
        {
          success: true,
          translatedText: transResult.translatedText,
          result: transResult.translatedText,
          sourceLang: transResult.sourceLang,
          targetLang: transResult.targetLang,
          tokensUsed: transResult.tokensUsed,
          remainingBalance: transResult.remainingBalance,
        },
        { status: 200 }
      );
    } catch (indicErr) {
      console.warn("IndicTrans raw translate failed, using fallback translator:", indicErr);
      const translatedText = await translate(text, finalSource, finalTarget, vendor || "local");
      return Response.json(
        {
          success: true,
          translatedText,
          result: translatedText,
          sourceLang: toFloresCode(finalSource, "eng_Latn"),
          targetLang: toFloresCode(finalTarget, "hin_Deva"),
        },
        { status: 200 }
      );
    }
  } catch (err: unknown) {
    console.error("Translation API error:", err);
    const msg = err instanceof Error ? err.message : "Translation service unavailable.";
    return Response.json({ message: msg }, { status: 500 });
  }
}