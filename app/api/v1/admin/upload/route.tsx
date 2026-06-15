import { Buffer } from "node:buffer";
import cloudinary from "@/lib/cloudinary";
import authenticateUser, { isAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

function uploadBuffer(buffer: Buffer, folder: string) {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{ folder, resource_type: "auto" },
			(error, result) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(result);
			}
		);

		uploadStream.end(buffer);
	});
}

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
		const uploadedFile = await uploadBuffer(Buffer.from(bytes), folder) as {
			secure_url?: string;
			public_id?: string;
			original_filename?: string;
		};

		return Response.json(
			{
				message: "File uploaded successfully",
				url: uploadedFile.secure_url,
				publicId: uploadedFile.public_id,
				filename: uploadedFile.original_filename,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Upload error:", error);
		return Response.json({ message: "Upload failed" }, { status: 500 });
	}
}
