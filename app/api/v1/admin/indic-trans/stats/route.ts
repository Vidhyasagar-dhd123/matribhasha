import authenticateUser, { isAdminUser } from "@/lib/auth";
import indicTransClient from "@/modules/translation/services/indicTrans.service";

// GET /api/v1/admin/indic-trans/stats - Get tenant analytics and quota
export async function GET(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const stats = await indicTransClient.getStats();
    return Response.json(stats, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin get IndicTrans stats error:", err);
    const msg = err instanceof Error ? err.message : "Failed to fetch IndicTrans stats";
    return Response.json({ message: msg }, { status: 500 });
  }
}

// POST /api/v1/admin/indic-trans/stats - Trigger dummy token topup (+5,000,000 tokens)
export async function POST(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const result = await indicTransClient.topupTokens();
    return Response.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin IndicTrans topup error:", err);
    const msg = err instanceof Error ? err.message : "Failed to top up tokens";
    return Response.json({ message: msg }, { status: 500 });
  }
}
