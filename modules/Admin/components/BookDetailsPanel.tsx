import { useEffect, useState } from "react"
import { useBooks } from "../Contexts/BooksContext";
import { deleteBook, updateBook } from "../Services/books";

export function BookDetailsPanel() {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [metadata, setMetadata] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [language, setLanguage] = useState("");
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const { selectedBook } = useBooks();

  useEffect(() => {
    if (selectedBook) {
      setBookName(selectedBook.title);
      setAuthorName(selectedBook.author);
      setMetadata(selectedBook.description);
      setGenre(selectedBook.genre);
      setIsbn(selectedBook.isbn);
      setLanguage(selectedBook.originalLanguage);
    }
      console.log("Selected Book:", selectedBook);
  }, [selectedBook]);

  return (
    <div className="w-[420px] border-l border-border bg-card p-6 overflow-y-auto">

      <h2 className="text-lg font-semibold mb-6">
        Book Details & Version Control
      </h2>

      {/* Author Profile */}

      <div className="space-y-3 mb-6">

        <h3 className="text-sm font-medium">
          Detailed Author Profiles
        </h3>

        <input
          placeholder="Name" value={bookName} onChange={(e) => setBookName(e.target.value)}
          className="w-full border border-input rounded-md px-3 py-2"
        />

        <input
          placeholder="Author" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
          className="w-full border border-input rounded-md px-3 py-2"
        />

        <textarea
          placeholder="Description" value={metadata} onChange={(e) => setMetadata(e.target.value)}
          className="w-full border border-input rounded-md px-3 py-2"
        />

      </div>

      {/* Metadata */}

      <div className="grid grid-cols-3 gap-3 mb-6">

        <select className="border border-input rounded-md px-3 py-2">
          <option>Genre</option>
        </select>

        <input
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="border border-input rounded-md px-3 py-2"
        />

        <select className="border border-input rounded-md px-3 py-2">
          <option>EN</option>
          <option>ES</option>
          <option>FR</option>
        </select>

      </div>

      {/* Version History */}

      <div className="space-y-3">

        <h3 className="text-sm font-medium">
          Version History Section
        </h3>

        <div className="border border-border rounded-md p-3">

          <div className="flex justify-between">

            <span className="font-medium">V1.0</span>

            <span className="text-xs bg-muted px-2 py-1 rounded">
              Draft
            </span>

          </div>

          <p className="text-xs text-muted-foreground">
            Published in 2021
          </p>

        </div>

      </div>

      {/* Buttons */}

      <div className="flex gap-3 mt-6">

        <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md" onClick={() => {
          updateBook(selectedBook?.uuid || "",{
            title: bookName,
            author: authorName,
            description: metadata,
            genre: genre,
            isbn: isbn,
            originalLanguage: language
          });
        }}>

          Save Detailed Changes
        </button>

        <button className="flex-1 border border-border rounded-md py-2 bg-red-600/80 text-white" onClick={() => selectedBook && deleteBook(selectedBook.uuid)}>
          DELETE
        </button>

      </div>

    </div>
  )
}