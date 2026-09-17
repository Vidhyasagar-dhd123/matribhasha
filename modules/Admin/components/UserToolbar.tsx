"use client"

import { Search } from "lucide-react"
import { useUsers } from "../contexts/UserContext"

export function UserToolbar() {
  const {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    setPage,
    loading,
    totalCount
  } = useUsers()

  return (
    <div className="flex items-center gap-3 flex-wrap">

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value)
            setPage(1)
          }}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm"
          placeholder="Search by name, username, email..."
          disabled={loading}
        />
      </div>

      <select
        value={roleFilter}
        onChange={(e) => {
          setRoleFilter(e.target.value)
          setPage(1)
        }}
        className="border border-input rounded-lg px-3 py-2 bg-background text-sm font-medium"
      >
        <option value="all">All Roles</option>
        <option value="admin">Admins Only</option>
        <option value="user">Users Only</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value)
          setPage(1)
        }}
        className="border border-input rounded-lg px-3 py-2 bg-background text-sm font-medium"
      >
        <option value="all">All Status</option>
        <option value="active">Active Only</option>
        <option value="blocked">Blocked Only</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => {
          setSortOrder(e.target.value)
          setPage(1)
        }}
        className="border border-input rounded-lg px-3 py-2 bg-background text-sm font-medium"
      >
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="name">Sort: Name (A-Z)</option>
      </select>

      <span className="text-xs text-muted-foreground font-semibold px-2">
        {totalCount} {totalCount === 1 ? "user" : "users"}
      </span>

    </div>
  )
}