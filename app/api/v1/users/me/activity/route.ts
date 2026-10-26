import connection from "@/lib/database";
import authenticateUser from "@/lib/auth";
import PageVersion from "@/modules/books/models/PageVersion.model";
import ReadingProgress from "@/modules/user/models/ReadingProgress.model";
import VivarPost from "@/modules/vivar/models/VivarPost.model";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connection();
    const userId = new mongoose.Types.ObjectId(currentUser.id);

    // 1. Fetch user's translations from PageVersion
    const userVersions = await PageVersion.find({ authorId: userId })
      .sort({ updatedAt: -1 })
      .populate({
        path: "pageId",
        select: "bookUUID pageNumber originalLanguage",
      })
      .lean();

    const translatedPageCount = userVersions.length;

    // Distinct books translated
    const translatedBookUUIDs = Array.from(
      new Set(
        userVersions
          .map((v) => (v.pageId as unknown as { bookUUID?: string })?.bookUUID)
          .filter(Boolean)
      )
    );

    const translatedBooks = await Book.find({ uuid: { $in: translatedBookUUIDs } })
      .select("title author uuid coverURI originalLanguage genre")
      .lean();

    // 2. Fetch active reading & workspace progress
    const progressList = await ReadingProgress.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    const progressBookUUIDs = Array.from(new Set(progressList.map((p) => p.bookUUID)));
    const progressBooks = await Book.find({ uuid: { $in: progressBookUUIDs } })
      .select("title author uuid coverURI originalLanguage totalPages")
      .lean();
    const progressBookMap = new Map(progressBooks.map((b) => [b.uuid, b]));

    const recentBookmarks = progressList.map((p) => ({
      ...p,
      book: progressBookMap.get(p.bookUUID) || null,
    }));

    // 3. Fetch user's Vivar posts & total likes received
    const userVivars = await VivarPost.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .lean();

    const totalLikesReceived = userVivars.reduce(
      (acc, curr) => acc + (curr.likes?.length || 0),
      0
    );

    // 4. Languages user translated into
    const translatedLanguages = Array.from(
      new Set(userVersions.map((v) => v.language).filter(Boolean))
    );

    return Response.json(
      {
        stats: {
          translatedPages: translatedPageCount,
          translatedBooks: translatedBooks.length,
          languagesCount: translatedLanguages.length,
          vivarPosts: userVivars.length,
          totalLikesReceived,
        },
        translatedLanguages,
        recentTranslations: userVersions.slice(0, 5),
        translatedBooks,
        recentBookmarks,
        recentVivars: userVivars.slice(0, 4),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
