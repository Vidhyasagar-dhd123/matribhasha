import { useEffect, useState } from "react";
import { useBooks } from "../contexts/BooksContext";
import { deleteBook, updateBook } from "../services/books";
import AddPage from "./AddPage";
import UploadDoc from "./UploadDoc";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export function BookDetailsPanel() {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [metadata, setMetadata] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [language, setLanguage] = useState("");
  const [coverURI, setCoverURI] = useState("");
  const [uploadURI, setUploadURI] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const { selectedBook, refreshBooks, setSelectedBook } = useBooks();

  useEffect(() => {
    if (selectedBook) {
      setBookName(selectedBook.title || "");
      setAuthorName(selectedBook.author || "");
      setMetadata(selectedBook.description || "");
      setGenre(selectedBook.genre || "");
      setIsbn(selectedBook.isbn || selectedBook.isbn13 || "");
      setLanguage(selectedBook.originalLanguage || "");
      setCoverURI(selectedBook.coverURI || "");
      setUploadURI(selectedBook.uploadURI || "");
      setStatus(null);
    }
  }, [selectedBook]);

  return (
    <div className="w-[420px] border-l border-border bg-card p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-6 text-foreground">
        Book Details & Version Control
      </h2>

      {/* Book Cover Preview & Upload */}
      <div className="mb-6 space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Book Cover
        </label>
        {coverURI ? (
          <div className="relative h-44 w-full rounded-xl overflow-hidden border border-border bg-muted/40 flex items-center justify-center">
            <Image
              src={coverURI}
              alt={bookName || "Book Cover"}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="h-28 w-full rounded-xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
            No cover image set
          </div>
        )}
        <UploadDoc
          label="Update Book Cover"
          folder="matribhasha/covers"
          accept="image/*"
          onUploaded={(url) => setCoverURI(url)}
        />
      </div>

      {/* Author & Basic Info */}
      <div className="space-y-3 mb-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Basic Details
        </label>

        <input
          placeholder="Book Title"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm text-foreground"
        />

        <input
          placeholder="Author"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm text-foreground"
        />

        <textarea
          placeholder="Description"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          className="w-full min-h-[90px] border border-input bg-background rounded-md px-3 py-2 text-sm text-foreground"
        />

        <UploadDoc
          label="Update Book File (PDF/EPUB)"
          folder="matribhasha/books"
          accept="application/pdf,.epub,.txt"
          onUploaded={(url) => setUploadURI(url)}
        />
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <input
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border border-input bg-background rounded-md px-3 py-2 text-xs text-foreground"
        />

        <input
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="border border-input bg-background rounded-md px-3 py-2 text-xs text-foreground"
        />

        <input
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-input bg-background rounded-md px-3 py-2 text-xs text-foreground"
        />
      </div>

      {selectedBook ? (
        <div className="space-y-4">
          <a
            href="/admin?page=pdf-ai"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 py-2.5 px-3 text-xs font-bold text-primary hover:bg-primary/20 transition"
          >
            <Sparkles size={14} />
            <span>Open PDF Intelligence &amp; AI Hub</span>
          </a>
          <AddPage bookUuid={selectedBook.uuid} />
        </div>
      ) : null}

      {/* Status feedback */}
      {status && (
        <p className="mt-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {status}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          disabled={saving || !selectedBook}
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium text-sm transition hover:bg-primary/90 disabled:opacity-50"
          onClick={async () => {
            if (!selectedBook) return;
            setSaving(true);
            setStatus(null);
            try {
              await updateBook(selectedBook.uuid, {
                title: bookName,
                author: authorName,
                description: metadata,
                genre: genre,
                isbn13: isbn,
                originalLanguage: language,
                coverURI: coverURI,
                uploadURI: uploadURI,
              });
              await refreshBooks();
              setStatus("Book updated successfully!");
            } catch (err) {
              console.error(err);
              setStatus("Failed to update book.");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          className="border border-destructive/30 rounded-md py-2 px-4 bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition"
          onClick={async () => {
            if (!selectedBook) return;
            if (!confirm(`Are you sure you want to delete "${selectedBook.title}"?`)) return;
            await deleteBook(selectedBook.uuid);
            setSelectedBook(null);
            await refreshBooks();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}