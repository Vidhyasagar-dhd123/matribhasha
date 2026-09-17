import authenticateUser, { isAdminUser } from "@/lib/auth";
import indicTransClient from "@/modules/translation/services/indicTrans.service";

// GET /api/v1/admin/pdf/[docId]/images - Get extracted images for a document
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
    const pageNumber = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;

    const result = await indicTransClient.getImages(docId, pageNumber);
    return Response.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin get PDF images error:", err);
    const msg = err instanceof Error ? err.message : "Failed to fetch PDF images";
    return Response.json({ message: msg }, { status: 500 });
  }
}
