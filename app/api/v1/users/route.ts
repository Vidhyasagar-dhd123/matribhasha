import connection from "@/lib/database"
import User from "@/modules/user/models/user.model"
import authenticateUser, { isAdminUser } from "@/lib/auth"


export async function GET(req:Request){
    try {
        const currentUser = await authenticateUser(req)
        if (!isAdminUser(currentUser)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        await connection()
        const searchParams = new URL(req.url).searchParams
        const search = searchParams.get("search")?.trim() || ""
        const sort = searchParams.get("sort") || "newest"
        const page = Math.max(1, Number(searchParams.get("page") || 1))
        const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit") || 10)))

        const filter: Record<string, unknown> = {}
        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            const regex = new RegExp(escaped, "i")
            filter.$or = [
                { name: regex },
                { email: regex },
                { role: regex },
            ]
        }

        const query = User.find(filter, "_id name email isBlocked role languages bio createdAt updatedAt")
        if (sort === "oldest") {
            query.sort({ createdAt: 1 })
        } else if (sort === "name") {
            query.sort({ name: 1 })
        } else {
            query.sort({ createdAt: -1 })
        }

        const totalCount = await User.countDocuments(filter)
        const users = await query.skip((page - 1) * limit).limit(limit)
        return Response.json({ users, page, limit, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / limit)) }, { status: 200 })
    } catch (error) {
        console.error("Error fetching users:", error)
        return Response.json({ message: "Unable to load users" }, { status: 500 })
    }
}