"use client"

import { PageHeader } from "./PageHeader"
import { BooksToolbar } from "./BooksToolbar"
import { BooksTable } from "./Table"
import { Pagination } from "./Pagination"
import { BookDetailsPanel } from "./BookDetailsPanel"
import { useBooks } from "../Contexts/BooksContext"
import { BookCreatePanel } from "./BookCreatePanel"

export default function BooksDashboard() {
  const { books, selectedBook } = useBooks();
  return (
    <div className="flex h-screen bg-background text-foreground">

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">

        <PageHeader />

        <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-4">

          <BooksToolbar />

          <BooksTable />

          <Pagination />

        </div>

      </div>
      {
        selectedBook ?
          <BookDetailsPanel />:
          <BookCreatePanel/>
      }

    </div>
  )
}