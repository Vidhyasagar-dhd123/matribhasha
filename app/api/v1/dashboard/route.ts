import { getCatalogAnalytics } from "@/lib/analytics"

export async function GET() {
  try {
    const analytics = await getCatalogAnalytics()
    return Response.json(analytics, { status: 200 })
  } catch (error) {
    console.error("Dashboard analytics error:", error)
    return Response.json({ message: "Unable to load dashboard analytics" }, { status: 500 })
  }
}