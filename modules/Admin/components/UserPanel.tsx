"use client"

import { PageHeader } from "./PageHeader"
import { UserToolbar } from "./UserToolbar"
import { UserTable } from "./UserTable"
import { Pagination } from "./Pagination"
import { UserDetailsPanel } from "./UserDetailsPanel"
import { useBooks } from "../Contexts/BooksContext"
import { useUsers } from "../Contexts/UserContext"

export default function UserPanel() {
  const { users } = useUsers();
  return (
    <div className="flex h-screen bg-background text-foreground">

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">

        <PageHeader />

        <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-4">

          <UserToolbar />

          <UserTable />

          <Pagination />

        </div>

      </div>

      <UserDetailsPanel />

    </div>
  )
}