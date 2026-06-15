import { useEffect, useState } from "react"
import { useBooks } from "../Contexts/BooksContext";
import { deleteBook, updateBook } from "../Services/books";
import AddPage from "./AddPage";

export function BookDetailsPanel() {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [metadata, setMetadata] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [language, setLanguage] = useState("");
  const { selectedBook, refreshBooks, setSelectedBook } = useBooks();

  useEffect(() => {
    if (selectedBook) {
      setBookName(selectedBook.title);
      setAuthorName(selectedBook.author);
      setMetadata(selectedBook.description);
      setGenre(selectedBook.genre);
      setIsbn(selectedBook.isbn || selectedBook.isbn13 || "");
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

        <input
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border border-input rounded-md px-3 py-2"
        />

        <input
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="border border-input rounded-md px-3 py-2"
        />

        <input
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-input rounded-md px-3 py-2"
        />

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

      {selectedBook ? <AddPage bookUuid={selectedBook.uuid} /> : null}

      {/* Buttons */}

      <div className="flex gap-3 mt-6">

        <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md" onClick={() => {
          updateBook(selectedBook?.uuid || "",{
            title: bookName,
            author: authorName,
            description: metadata,
            genre: genre,
            isbn13: isbn,
            originalLanguage: language,
          }).then(async () => {
            await refreshBooks();
          });
        }}>

          Save Detailed Changes
        </button>

        <button className="flex-1 border border-border rounded-md py-2 bg-red-600/80 text-white" onClick={async () => {
          if (!selectedBook) return;
          await deleteBook(selectedBook.uuid)
          setSelectedBook(null)
          await refreshBooks()
        }}>
          DELETE
        </button>

      </div>

    </div>
  )
}