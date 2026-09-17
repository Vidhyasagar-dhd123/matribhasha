import { getCatalogAnalytics } from "@/lib/analytics"
import authenticateUser, { isAdminUser } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const currentUser = await authenticateUser(req)
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 })
    }

    const analytics = await getCatalogAnalytics()
    return Response.json(analytics, { status: 200 })
  } catch (error) {
    console.error("Dashboard analytics error:", error)
    return Response.json({ message: "Unable to load dashboard analytics" }, { status: 500 })
  }
}