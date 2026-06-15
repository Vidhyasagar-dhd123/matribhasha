import { useEffect, useState } from "react"
import { useBooks } from "../Contexts/BooksContext";
import { createBook } from "../Services/books";
import { headingToId } from "@/lib/utils";
import UploadDoc from "./UploadDoc";

export function BookCreatePanel() {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [metadata, setMetadata] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [language, setLanguage] = useState("");
  const [coverURI, setCoverURI] = useState("");
  const [uploadURI, setUploadURI] = useState("");
  const { selectedBook, setSelectedBook, refreshBooks } = useBooks();

  const refresh = () => {
    setBookName("")
    setAuthorName("")
    setMetadata("")
    setGenre("")
    setIsbn("")
    setLanguage("")
    setCoverURI("")
    setUploadURI("")
  }

  useEffect(() => {
    if (selectedBook) {
        setSelectedBook(null)
    }
      console.log("Selected Book:", selectedBook);
  }, [selectedBook]);

  return (
    <div className="w-[420px] border-l border-border bg-card p-6 overflow-y-auto">

      <h2 className="text-lg font-semibold mb-6">
        Create A Book
      </h2>

      {/* Author Profile */}

      <div className="space-y-3 mb-6">

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

        <UploadDoc label="Upload Book Cover" folder="matribhasha/covers" accept="image/*" onUploaded={setCoverURI} />

        <UploadDoc label="Upload Book File" folder="matribhasha/books" accept="application/pdf,.epub,.txt" onUploaded={setUploadURI} />

      </div>

      {/* Metadata */}

      <div className="grid grid-cols-3 gap-3 mb-6">

        <select className="border border-input rounded-md px-3 py-2" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option>Genre</option>
        </select>

        <input
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="border border-input rounded-md px-3 py-2"
        />

        <select className="border border-input rounded-md px-3 py-2" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>EN</option>
          <option>ES</option>
          <option>FR</option>
        </select>

      </div>
      {/* Buttons */}

      <div className="flex gap-3 mt-6">

        <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md" onClick={async () => {
          const created = await createBook({
            title: bookName,
            author: authorName,
            description: metadata,
            uuid:headingToId(bookName),
            originalLanguage:language,
            coverURI,
            uploadURI,
          });
          await refreshBooks();
          if (created?._id) {
            setSelectedBook(created);
          }
          refresh();
        }}>
          Create
        </button>
      </div>

    </div>
  )
}