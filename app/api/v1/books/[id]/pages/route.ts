import authenticateUser, { isAdminUser } from "@/lib/auth";
import connection from "@/lib/database";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await authenticateUser(req) as { id?: string; _id?: string; role?: string } | null;
        if (!isAdminUser(currentUser)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connection();
        const { id } = await params;
        const body = await req.json();
        const pageNumber = Number(body.pageNumber);
        const originalLanguage = String(body.originalLanguage || "").trim();
        const content = String(body.content || "").trim();

        if (!id || !Number.isFinite(pageNumber) || pageNumber <= 0 || !originalLanguage || !content) {
            return Response.json({ message: "Invalid Request" }, { status: 400 });
        }

        const book = await Book.findOne({ uuid: id });
        if (!book) {
            return Response.json({ message: "Book Not Found" }, { status: 404 });
        }

        const existingPage = await Page.findOne({ bookUUID: id, pageNumber });
        if (existingPage) {
            return Response.json({ message: "Page already exists" }, { status: 409 });
        }

        const page = await Page.create({
            bookId: book._id,
            bookUUID: id,
            pageNumber,
            originalLanguage,
        });

        const version = await PageVersion.create({
            pageId: page._id,
            language: originalLanguage,
            content,
            authorId: String(currentUser?.id || currentUser?._id || ""),
        });

        await Book.findByIdAndUpdate(book._id, {
            $addToSet: { pages: page._id },
            $set: { totalPages: Math.max(Number(book.totalPages || 0), pageNumber) },
        });

        return Response.json({ message: "Page Created Successfully", page, version }, { status: 201 });
    } catch (err) {
        console.error("Error creating page:", err);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}