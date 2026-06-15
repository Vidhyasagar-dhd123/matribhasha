import authenticateUser, { isAdminUser } from "@/lib/auth"
import { getCatalogAnalytics } from "@/lib/analytics"

export async function GET(request: Request) {
  try {
    const currentUser = await authenticateUser(request)
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const analytics = await getCatalogAnalytics()
    return Response.json(analytics, { status: 200 })
  } catch (error) {
    console.error("Admin analytics error:", error)
    return Response.json({ message: "Unable to load analytics" }, { status: 500 })
  }
}