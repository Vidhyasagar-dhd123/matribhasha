export function PageHeader({
  section = "Books Management",
  title = "Dashboard",
  heading,
}: {
  section?: string
  title?: string
  heading?: string
}) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">
        {section} / <span className="text-foreground">{title}</span>
      </div>

      <h1 className="text-2xl font-semibold">
        {heading || (title === "Dashboard" ? "Manage Books" : title)}
      </h1>
    </div>
  )
}