import { Search } from "lucide-react"

export function UserToolbar() {
  return (
    <div className="flex items-center gap-3 flex-wrap">

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background"
          placeholder="Enter Username, Email..."
        />
      </div>

      <select className="border border-input rounded-md px-3 py-2 bg-background">
        <option>Status</option>
        <option>All</option>
        <option>Published</option>
        <option>Draft</option>
      </select>

      <select className="border border-input rounded-md px-3 py-2 bg-background">
        <option>Genre</option>
        <option>All</option>
      </select>

      <select className="border border-input rounded-md px-3 py-2 bg-background">
        <option>Sort</option>
        <option>Newest</option>
        <option>Oldest</option>
      </select>

    </div>
  )
}