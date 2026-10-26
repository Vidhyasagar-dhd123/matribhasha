import connection from "@/lib/database";
import ReadingProgress from "@/modules/user/models/ReadingProgress.model";
import Book from "@/modules/books/models/Book.model";
import authenticateUser from "@/lib/auth";
import { z } from "zod";

const ProgressSchema = z.object({
  bookUUID: z.string().min(1),
  pageNumber: z.number().int().min(1),
  language: z.string().min(1),
  role: z.enum(["reader", "translator"]).default("reader"),
});

export async function POST(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ProgressSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid progress payload", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    await connection();
    const { bookUUID, pageNumber, language, role } = parsed.data;

    const progress = await ReadingProgress.findOneAndUpdate(
      {
        userId: currentUser.id,
        bookUUID,
        role,
      },
      {
        $set: {
          pageNumber,
          language,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return Response.json(progress, { status: 200 });
  } catch (error) {
    console.error("Error saving progress:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookUUID = searchParams.get("bookUUID");
    const role = searchParams.get("role") || undefined;

    await connection();

    const query: Record<string, unknown> = { userId: currentUser.id };
    if (bookUUID) query.bookUUID = bookUUID;
    if (role) query.role = role;

    const progressList = await ReadingProgress.find(query).sort({ updatedAt: -1 }).lean();

    // Fetch book details
    const bookUUIDs = Array.from(new Set(progressList.map((p) => p.bookUUID)));
    const books = await Book.find({ uuid: { $in: bookUUIDs } })
      .select("title author uuid coverURI originalLanguage totalPages")
      .lean();

    const bookMap = new Map(books.map((b) => [b.uuid, b]));

    const enriched = progressList.map((p) => ({
      ...p,
      book: bookMap.get(p.bookUUID) || null,
    }));

    return Response.json(enriched, { status: 200 });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
