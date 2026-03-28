export function Pagination() {
  return (
    <div className="flex justify-end items-center gap-2 pt-3">

      <button className="px-3 py-1 border border-border rounded-md text-sm">
        Prev
      </button>

      <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
        1
      </button>

      <button className="px-3 py-1 border border-border rounded-md">
        2
      </button>

      <button className="px-3 py-1 border border-border rounded-md">
        3
      </button>

      <span className="px-2 text-muted-foreground">...</span>

      <button className="px-3 py-1 border border-border rounded-md">
        72
      </button>

      <button className="px-3 py-1 border border-border rounded-md">
        Next
      </button>

    </div>
  )
}