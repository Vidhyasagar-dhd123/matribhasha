import React from "react";
import { useBooks } from "../Contexts/BooksContext";


export function BooksTable() {
  const { books, selectedBook, setSelectedBook, loading } = useBooks();

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

        {!loading && books.map((book) => (

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

        {!loading && !books.length ? (
          <tr>
            <td colSpan={4} className="p-4 text-center text-muted-foreground">No books found.</td>
          </tr>
        ) : null}

      </tbody>
    </table>
  )
}