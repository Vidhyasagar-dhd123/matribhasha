import authenticateUser, { isAdminUser } from "@/lib/auth";
import * as documentTranslation from "@/modules/translation/services/document-translation.service";

// GET /api/v1/admin/documents - List all uploaded documents for the tenant
export async function GET(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const docs = await documentTranslation.listDocuments();
    return Response.json(docs, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin get PDF docs error:", err);
    const msg = err instanceof Error ? err.message : "Failed to fetch PDF documents";
    return Response.json({ message: msg }, { status: 500 });
  }
}

// POST /api/v1/admin/documents - Upload PDF document (multipart)
export async function POST(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return Response.json({ message: "PDF file is required in 'file' form field." }, { status: 400 });
    }

    const uploadResult = await documentTranslation.uploadDocument(formData);
    return Response.json(uploadResult, { status: 201 });
  } catch (err: unknown) {
    console.error("Admin PDF upload error:", err);
    const msg = err instanceof Error ? err.message : "Failed to upload PDF document";
    return Response.json({ message: msg }, { status: 500 });
  }
}
