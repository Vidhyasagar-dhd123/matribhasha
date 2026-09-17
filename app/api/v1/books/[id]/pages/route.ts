import connection from "@/lib/database";
import Page from "@/modules/books/models/Pages.model";
import Book from "@/modules/books/models/Book.model";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connection();
    const { id } = await params;

    if (!id) {
      return Response.json({ message: "Book ID is required" }, { status: 400 });
    }

    let book = await Book.findOne({ uuid: id });
    if (!book) {
      book = await Book.findById(id).catch(() => null);
    }

    const query = book ? { $or: [{ bookUUID: book.uuid }, { bookId: book._id }] } : { bookUUID: id };
    const pages = await Page.find(query).sort({ pageNumber: 1 });

    return Response.json(pages, { status: 200 });
  } catch (err) {
    console.error("Fetch pages error:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}