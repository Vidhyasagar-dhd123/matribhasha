"use client";

import { useState } from "react";
import { getRequestHeaders } from "@/modules/shared/utils/request";

interface UploadDocProps {
	label?: string;
	folder?: string;
	accept?: string;
	onUploaded?: (url: string) => void;
}

export default function UploadDoc({
	label = "Upload Document",
	folder = "matribhasha",
	accept = "*/*",
	onUploaded,
}: UploadDocProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("folder", folder);

		setIsUploading(true);
		setMessage(null);

		try {
			const response = await fetch("/api/v1/admin/upload", {
				method: "POST",
				headers: getRequestHeaders(false),
				body: formData,
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data?.message || "Upload failed");
			}

			if (data?.url && onUploaded) {
				onUploaded(data.url);
			}

			setMessage(data?.message || "Uploaded successfully");
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Upload failed");
		} finally {
			setIsUploading(false);
			event.target.value = "";
		}
	};

	return (
		<label className="flex flex-col gap-2 rounded-md border border-dashed border-border p-4 text-sm cursor-pointer hover:bg-accent/40 transition">
			<span className="font-medium">{label}</span>
			<span className="text-muted-foreground">Drop or choose a file to upload</span>
			<input className="hidden" type="file" accept={accept} onChange={handleUpload} disabled={isUploading} />
			<span className="text-xs text-muted-foreground">{isUploading ? "Uploading..." : message || ""}</span>
		</label>
	);
}
