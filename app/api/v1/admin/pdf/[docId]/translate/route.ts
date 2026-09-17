import authenticateUser, { isAdminUser } from "@/lib/auth";
import indicTransClient from "@/modules/translation/services/indicTrans.service";

// POST /api/v1/admin/pdf/[docId]/translate - Translate single page, range, or all pages
export async function POST(
  req: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { docId } = await params;
    const body = await req.json();
    const mode = body.mode || (body.page_number ? "single" : "all");
    const targetLang = body.target_lang || body.targetLang || "hin_Deva";
    const sourceLang = body.source_lang || body.sourceLang || "eng_Latn";

    let result;
    if (mode === "single") {
      const pageNumber = Number(body.page_number || 1);
      result = await indicTransClient.translatePage(docId, pageNumber, targetLang, sourceLang);
    } else if (mode === "range") {
      const startPage = Number(body.start_page || 1);
      const endPage = Number(body.end_page || startPage);
      result = await indicTransClient.translateRange(docId, startPage, endPage, targetLang, sourceLang);
    } else {
      // mode === "all"
      result = await indicTransClient.translateAll(docId, targetLang, sourceLang);
    }

    return Response.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin translate PDF error:", err);
    const msg = err instanceof Error ? err.message : "Failed to translate PDF";
    return Response.json({ message: msg }, { status: 500 });
  }
}

// GET /api/v1/admin/pdf/[docId]/translate - Get stored translations for document
export async function GET(
  req: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { docId } = await params;
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "hin_Deva";
    const all = searchParams.get("all") !== "false";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;

    const result = await indicTransClient.getTranslations(docId, lang, all, page);
    return Response.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin get PDF translations error:", err);
    const msg = err instanceof Error ? err.message : "Failed to get PDF translations";
    return Response.json({ message: msg }, { status: 500 });
  }
}
