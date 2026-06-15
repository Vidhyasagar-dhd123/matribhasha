import connection from "@/lib/database";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import User from "@/modules/user/models/user.model";
import VivarPost from "@/modules/vivar/models/VivarPost.model";

export async function GET() {
  try {
    await connection();

    const [
      booksCount,
      pagesCount,
      versionsCount,
      usersCount,
      vivarPostsCount,
      languageStats,
      monthlyStats,
      posts,
    ] = await Promise.all([
      Book.countDocuments(),
      Page.countDocuments(),
      PageVersion.countDocuments(),
      User.countDocuments(),
      VivarPost.countDocuments(),
      PageVersion.aggregate([
        { $group: { _id: "$language", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      PageVersion.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      VivarPost.find({}, "likes"),
    ]);

    const totalLikes = posts.reduce(
      (sum: number, post: { likes?: unknown[] }) => sum + (post.likes?.length || 0),
      0
    );

    return Response.json(
      {
        totals: {
          books: booksCount,
          pages: pagesCount,
          versions: versionsCount,
          users: usersCount,
          vivarPosts: vivarPostsCount,
          likes: totalLikes,
        },
        translationsByLang: languageStats.map((item: { _id?: string; count: number }) => ({
          lang: item._id || "Unknown",
          count: item.count,
        })),
        translationsFrequency: monthlyStats.map((item: { _id: { year: number; month: number }; count: number }) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
          count: item.count,
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ message: "Something Went Wrong" }, { status: 500 });
  }
}
