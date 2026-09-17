import connection from "@/lib/database";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import ReadingProgress from "@/modules/user/models/ReadingProgress.model";
import Review from "@/modules/books/models/Review.model";
import VivarPost from "@/modules/vivar/models/VivarPost.model";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connection();

    // 1. Pages for this book
    const pages = await Page.find({ bookUUID: id }).select("_id pageNumber");
    const pageIds = pages.map((p) => p._id);

    // 2. Recent translations
    const recentTranslations = await PageVersion.find({ pageId: { $in: pageIds } })
      .sort({ updatedAt: -1 })
      .limit(6)
      .populate("authorId", "name username")
      .populate("pageId", "pageNumber bookUUID")
      .lean();

    // 3. Recent reviews
    const recentReviews = await Review.find({ bookUUID: id })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("userId", "name username")
      .lean();

    // 4. Recent Vivar quotes
    const recentVivars = await VivarPost.find({ bookUUID: id })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("authorId", "name username")
      .lean();

    // Format events into a unified activity timeline
    const activities = [
      ...recentTranslations.map((t) => ({
        type: "translation",
        title: `Page ${(t.pageId as unknown as { pageNumber?: number })?.pageNumber || 1} translated into ${t.language}`,
        author: (t.authorId as unknown as { name?: string; username?: string })?.name || "Translator",
        timestamp: t.updatedAt,
      })),
      ...recentReviews.map((r) => ({
        type: "review",
        title: `Rated ${r.rating} stars: "${r.title || r.comment.slice(0, 40)}..."`,
        author: (r.userId as unknown as { name?: string })?.name || "Reader",
        timestamp: r.createdAt,
      })),
      ...recentVivars.map((v) => ({
        type: "vivar",
        title: `Shared quote from Page ${v.pageNumber}: "${v.selectedText.slice(0, 40)}..."`,
        author: (v.authorId as unknown as { name?: string })?.name || "Reader",
        timestamp: v.createdAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return Response.json(
      {
        totalEvents: activities.length,
        activities: activities.slice(0, 15),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching book activity:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
