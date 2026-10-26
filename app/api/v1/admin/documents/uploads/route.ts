import { Buffer } from "node:buffer";
import authenticateUser, { isAdminUser } from "@/lib/auth";
import { getStorageAdapter } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(request: Request) {
	const currentUser = await authenticateUser(request);
	if (!isAdminUser(currentUser)) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	return Response.json({ message: "Upload endpoint ready" }, { status: 200 });
}

export async function POST(request: Request) {
	try {
		const currentUser = await authenticateUser(request);
		if (!isAdminUser(currentUser)) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get("file");

		if (!(file instanceof File)) {
			return Response.json({ message: "File is required" }, { status: 400 });
		}

		const folder = formData.get("folder")?.toString() || "matribhasha";
		const bytes = await file.arrayBuffer();
		const adapter = getStorageAdapter();
		const uploadedFile = await adapter.upload(Buffer.from(bytes), file.name, folder);

		return Response.json(
			{
				message: "File uploaded successfully",
				url: uploadedFile.url,
				publicId: uploadedFile.publicId,
				filename: uploadedFile.filename,
				provider: uploadedFile.provider,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Upload error:", error);
		return Response.json({ message: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
	}
}

