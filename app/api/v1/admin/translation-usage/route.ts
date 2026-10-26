import authenticateUser, { isAdminUser } from "@/lib/auth";
import * as documentTranslation from "@/modules/translation/services/document-translation.service";

// GET /api/v1/admin/translation-usage - Get tenant analytics and quota
export async function GET(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const stats = await documentTranslation.getTranslationUsage();
    return Response.json(stats, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin get IndicTrans stats error:", err);
    const msg = err instanceof Error ? err.message : "Failed to fetch IndicTrans stats";
    return Response.json({ message: msg }, { status: 500 });
  }
}

// POST /api/v1/admin/translation-usage - Trigger dummy token topup (+5,000,000 tokens)
export async function POST(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const result = await documentTranslation.topUpTranslationTokens();
    return Response.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin IndicTrans topup error:", err);
    const msg = err instanceof Error ? err.message : "Failed to top up tokens";
    return Response.json({ message: msg }, { status: 500 });
  }
}
