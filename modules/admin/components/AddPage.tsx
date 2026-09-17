"use client";

import { useState } from "react";

interface AddPageProps {
	bookUuid: string;
	onCreated?: () => void;
}

export default function AddPage({ bookUuid, onCreated }: AddPageProps) {
	const [pageNumber, setPageNumber] = useState(1);
	const [originalLanguage, setOriginalLanguage] = useState("en");
	const [content, setContent] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setStatus(null);

		try {
			const response = await fetch(`/api/v1/books/${bookUuid}/pages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pageNumber, originalLanguage, content }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data?.message || "Failed to create page");
			}

			setStatus(data?.message || "Page created");
			setContent("");
			setPageNumber((current) => current + 1);
			if (onCreated) {
				onCreated();
			}
		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Failed to create page");
		} finally {
			setSaving(false);
		}
	};

	return (
		<form className="space-y-3 rounded-md border border-border p-4" onSubmit={handleSubmit}>
			<div>
				<div className="text-sm font-medium mb-2">Add Page</div>
				<div className="text-xs text-muted-foreground">Create a page draft and its first version for the selected book.</div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<input
					type="number"
					min={1}
					value={pageNumber}
					onChange={(event) => setPageNumber(Number(event.target.value))}
					className="w-full border border-input rounded-md px-3 py-2"
					placeholder="Page number"
				/>
				<input
					value={originalLanguage}
					onChange={(event) => setOriginalLanguage(event.target.value)}
					className="w-full border border-input rounded-md px-3 py-2"
					placeholder="Language"
				/>
			</div>

			<textarea
				value={content}
				onChange={(event) => setContent(event.target.value)}
				className="w-full min-h-32 border border-input rounded-md px-3 py-2"
				placeholder="Page content"
			/>

			<button type="submit" disabled={saving} className="w-full rounded-md bg-primary px-3 py-2 text-primary-foreground disabled:opacity-60">
				{saving ? "Saving..." : "Create Page"}
			</button>

			{status ? <div className="text-xs text-muted-foreground">{status}</div> : null}
		</form>
	);
}
