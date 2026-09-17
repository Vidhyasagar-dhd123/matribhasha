import authenticateUser, { isAdminUser } from "@/lib/auth";
import indicTransClient from "@/modules/translation/services/indicTrans.service";

// GET /api/v1/admin/pdf/[docId]/pages - Get extracted pages (query: ?page=1 or ?start=1&end=5 or ?all=true)
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
    const all = searchParams.get("all") === "true";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
    const start = searchParams.get("start") ? Number(searchParams.get("start")) : undefined;
    const end = searchParams.get("end") ? Number(searchParams.get("end")) : undefined;

    const result = await indicTransClient.getPages(docId, { all, page, start, end });
    return Response.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin get PDF pages error:", err);
    const msg = err instanceof Error ? err.message : "Failed to fetch PDF pages";
    return Response.json({ message: msg }, { status: 500 });
  }
}

// POST /api/v1/admin/pdf/[docId]/pages - Extract page manually
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
    const body = await req.json().catch(() => ({}));
    const pageNumber = body.page_number ? Number(body.page_number) : undefined;

    const result = await indicTransClient.extractPage(docId, pageNumber);
    return Response.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin extract PDF page error:", err);
    const msg = err instanceof Error ? err.message : "Failed to extract PDF page";
    return Response.json({ message: msg }, { status: 500 });
  }
}
