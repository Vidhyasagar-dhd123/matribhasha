import connection from "@/lib/database";
import { getCurrentUser } from "@/lib/current-user";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import VivarPost from "@/modules/vivar/models/VivarPost.model";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    await connection();
    const posts = await VivarPost.find()
      .sort({ createdAt: -1 })
      .populate({ path: "authorId", select: "name email -_id" })
      .lean();

    return Response.json(
      posts.map((post) => ({
        ...post,
        likesCount: post.likes?.length || 0,
      })),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ message: "Something Went Wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connection();
    const user = await getCurrentUser(req);

    if (!user) {
      return Response.json({ message: "Authentication required" }, { status: 401 });
    }

    const { selectedText, caption, bookUUID, pageNumber, language } = await req.json();
    const numericPageNo = Number(pageNumber);

    if (!selectedText || !bookUUID || Number.isNaN(numericPageNo) || !language) {
      return Response.json(
        { message: "Selected text, book, page, and language are required" },
        { status: 400 }
      );
    }

    const [book, page] = await Promise.all([
      Book.findOne({ uuid: bookUUID }),
      Page.findOne({ bookUUID, pageNumber: numericPageNo }),
    ]);

    if (!book || !page) {
      return Response.json({ message: "Book or page not found" }, { status: 404 });
    }

    const sourceVersion = await PageVersion.findOne({
      pageId: page._id,
      language,
    }).sort({ updatedAt: -1 });

    const post = await VivarPost.create({
      selectedText,
      caption,
      bookUUID,
      bookTitle: book.title,
      pageNumber: numericPageNo,
      language,
      sourceVersionId: sourceVersion?._id,
      authorId: user._id,
      likes: [],
    });

    const populatedPost = await post.populate({ path: "authorId", select: "name email -_id" });

    return Response.json(
      {
        ...populatedPost.toObject(),
        likesCount: 0,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ message: "Something Went Wrong" }, { status: 500 });
  }
}
