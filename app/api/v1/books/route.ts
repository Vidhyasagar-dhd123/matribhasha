import Book from "@/modules/books/models/Book.model";
import connection from "@/lib/database";
import authenticateUser, { isAdminUser } from "@/lib/auth";
export async function GET(req:Request){
    try{
        await connection()
        const {searchParams} = new URL(req.url)
        const search = searchParams.get("search")?.trim() || ""
        const page = Math.max(1, Number(searchParams.get("page") || 1))
        const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit") || 12)))
        const sort = searchParams.get("sort") || "newest"

        const filter: Record<string, unknown> = {}
        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            const regex = new RegExp(escaped, "i")
            filter.$or = [
                { title: regex },
                { author: regex },
                { description: regex },
                { genre: regex },
                { originalLanguage: regex },
                { uuid: regex },
                { isbn13: regex },
            ]
        }

        const query = Book.find(filter)
        if (sort === "oldest") {
            query.sort({ createdAt: 1 })
        } else if (sort === "title") {
            query.sort({ title: 1 })
        } else {
            query.sort({ createdAt: -1 })
        }

        if (searchParams.has("page") || searchParams.has("limit") || search) {
            const totalCount = await Book.countDocuments(filter)
            const books = await query.skip((page - 1) * limit).limit(limit)
            return Response.json({
                books,
                page,
                limit,
                totalCount,
                totalPages: Math.max(1, Math.ceil(totalCount / limit)),
            },{status:200})
        }

        const Books = await query
        return Response.json(Books,{status:200})
    }
    catch(err)
    {   
        console.log(err)
        return Response.json({message:"error"},{status:400})
    }
}

export async function POST(req:Request){
    try{
        const currentUser = await authenticateUser(req)
        if (!isAdminUser(currentUser)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        await connection()
        const newBook = new Book(body)
        await newBook.save()
        return Response.json(newBook,{status:201})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({message:"error"},{status:400})
    }
}