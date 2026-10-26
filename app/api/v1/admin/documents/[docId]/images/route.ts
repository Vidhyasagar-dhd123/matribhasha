import authenticateUser, { isAdminUser } from "@/lib/auth";
import * as documentTranslation from "@/modules/translation/services/document-translation.service";

// GET /api/v1/admin/documents/[docId]/images - Get extracted images for a document
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

    const result = await documentTranslation.getDocumentImages(docId, pageNumber);
    return Response.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin get PDF images error:", err);
    const msg = err instanceof Error ? err.message : "Failed to fetch PDF images";
    return Response.json({ message: msg }, { status: 500 });
  }
}
