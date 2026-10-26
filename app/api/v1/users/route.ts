import connection from "@/lib/database"
import User from "@/modules/user/models/user.model"
import authenticateUser, { isAdminUser } from "@/lib/auth"
import { signJWT } from "@/modules/auth/utils/jwt"
import { hashPassword } from "@/modules/auth/utils/password"
import { createUser } from "@/modules/user/service/user.services"
import { z } from "zod"

const signupSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters").max(30),
    name: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(req: Request) {
    try {
        await connection()
        const body = await req.json()
        const result = signupSchema.safeParse(body)

        if (!result.success) {
            return Response.json(
                { message: result.error.issues[0]?.message || "Invalid inputs" },
                { status: 400 }
            )
        }

        const { email, username, name, password } = result.data
        const normalizedEmail = email.toLowerCase().trim()
        const normalizedUsername = username.toLowerCase().trim()
        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
        })

        if (existingUser) {
            return Response.json(
                {
                    message: existingUser.email === normalizedEmail
                        ? "An account with this email already exists."
                        : "This username is already taken.",
                },
                { status: 409 }
            )
        }

        const user = await createUser({
            name: name || username,
            username: normalizedUsername,
            email: normalizedEmail,
            password: await hashPassword(password),
        })
        const userId = String(user._id)
        const role = user.role || "user"
        const token = signJWT({
            id: userId,
            username: user.username,
            email: user.email,
            role,
        })

        return Response.json(
            {
                user: {
                    id: userId,
                    _id: userId,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role,
                },
                token,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("User registration error:", error)
        return Response.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(req:Request){
    try {
        const currentUser = await authenticateUser(req)
        if (!isAdminUser(currentUser)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        await connection()
        const searchParams = new URL(req.url).searchParams
        const search = searchParams.get("search")?.trim() || ""
        const role = searchParams.get("role")?.trim() || ""
        const status = searchParams.get("status")?.trim() || ""
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
                { username: regex },
            ]
        }

        if (role && role !== "all") {
            filter.role = role
        }

        if (status === "active") {
            filter.isBlocked = false
        } else if (status === "blocked") {
            filter.isBlocked = true
        }

        const query = User.find(filter, "_id name username email isBlocked role languages bio createdAt updatedAt")
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