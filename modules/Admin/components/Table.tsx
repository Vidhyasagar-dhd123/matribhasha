import React, {useEffect, useState} from "react";
import { useBooks } from "../Contexts/BooksContext";
import { Book } from "@/modules/books/utils/books";


export function BooksTable() {
  const [books, setBooks] = useState<Book[]>([] as Book[]);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const { selectedBook, setSelectedBook } = useBooks();

  useEffect(() => {
    // Fetch books data from the API
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v1/books`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <table className="w-full text-sm">

      <thead className="border-b border-border text-muted-foreground">
        <tr className="text-left">

          <th className="p-2 w-10">
            <input type="checkbox"/>
          </th>

          <th className="p-2">ID</th>
          <th className="p-2">Title</th>
          <th className="p-2">Author(s)</th>

        </tr>
      </thead>

      <tbody>

        {books.map((book) => (

          <tr
            key={book._id}
            className="border-b border-border hover:bg-muted/40 transition-standard"
          >

            <td className="p-2">
              <input type="checkbox" checked={selectedBook?. _id === book._id}  onChange={()=>{selectedBook?. _id === book._id ? setSelectedBook(null) : setSelectedBook(book)}}/>
            </td>

            <td className="p-2">{book._id}</td>

            <td className="p-2 font-medium">
              {book.title}
            </td>

            <td className="p-2">
              {book.author}
            </td>

          </tr>

        ))}

      </tbody>
    </table>
  )
}