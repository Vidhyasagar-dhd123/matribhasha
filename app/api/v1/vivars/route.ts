import connection from "@/lib/database";
import authenticateUser from "@/lib/auth";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import VivarPost from "@/modules/vivar/models/VivarPost.model";
import { z } from "zod";

const VivarCreateSchema = z.object({
  selectedText: z.string().min(1, "Selected text is required"),
  caption: z.string().optional().default(""),
  bookUUID: z.string().min(1, "Book UUID is required"),
  pageNumber: z.coerce.number().int().min(0, "Page number must be 0 or greater"),
  language: z.string().min(1, "Language is required"),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookUUID = searchParams.get("bookUUID");
    const language = searchParams.get("language");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const skip = Number(searchParams.get("skip")) || 0;

    await connection();

    const filter: Record<string, unknown> = {};
    if (bookUUID) filter.bookUUID = bookUUID;
    if (language) filter.language = language;

    const posts = await VivarPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "authorId", select: "name username email _id" })
      .lean();

    return Response.json(
      posts.map((post) => ({
        ...post,
        likesCount: post.likes?.length || 0,
      })),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching Vivar posts:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Authentication required" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = VivarCreateSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid Vivar post data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    await connection();
    const { selectedText, caption, bookUUID, pageNumber, language } = parsed.data;

    let book = await Book.findOne({ uuid: bookUUID });
    if (!book) {
      book = await Book.findById(bookUUID).catch(() => null);
    }

    if (!book) {
      return Response.json({ message: "Book not found" }, { status: 404 });
    }

    const page = await Page.findOne({ bookUUID: book.uuid, pageNumber });

    let sourceVersion = null;
    if (page) {
      sourceVersion = await PageVersion.findOne({
        pageId: page._id,
        language,
      }).sort({ updatedAt: -1 });
    }

    const authorUserId = currentUser.id || (currentUser as { _id?: string })._id;

    const post = await VivarPost.create({
      selectedText,
      caption,
      bookUUID: book.uuid,
      bookTitle: book.title,
      pageNumber,
      language,
      sourceVersionId: sourceVersion?._id,
      authorId: authorUserId,
      likes: [],
    });

    const populatedPost = await post.populate({
      path: "authorId",
      select: "name username email _id",
    });

    return Response.json(
      {
        ...populatedPost.toObject(),
        likesCount: 0,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating Vivar post:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
