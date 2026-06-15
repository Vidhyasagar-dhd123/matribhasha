import connection from "@/lib/database"
import Book from "@/modules/books/models/Book.model"
import Page from "@/modules/books/models/Pages.model"
import PageVersion from "@/modules/books/models/PageVersion.model"
import User from "@/modules/user/models/user.model"
import VivarPost from "@/modules/vivar/models/VivarPost.model"

function monthLabel(month: number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month] || "Unknown"
}

export async function getCatalogAnalytics() {
  await connection()

  const [
    totalBooks,
    totalUsers,
    totalPages,
    totalVersions,
    booksByLanguage,
    recentBooks,
    topAuthors,
    monthlyBooks,
    multiVersionResult,
    pageVersionsByBook,
    vivarPosts,
  ] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments(),
    Page.countDocuments(),
    PageVersion.countDocuments(),
    Book.aggregate([
      { $group: { _id: "$originalLanguage", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
    Book.find().sort({ createdAt: -1 }).limit(6).select("title author originalLanguage uuid coverURI createdAt pages genre"),
    Book.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 6 },
    ]),
    Book.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]),
    PageVersion.aggregate([
      {
        $lookup: {
          from: "pages",
          localField: "pageId",
          foreignField: "_id",
          as: "page",
        },
      },
      { $unwind: "$page" },
      {
        $group: {
          _id: "$page.bookUUID",
          versionsCount: { $sum: 1 },
        },
      },
      { $match: { versionsCount: { $gt: 1 } } },
      { $count: "count" },
    ]),
    PageVersion.aggregate([
      {
        $lookup: {
          from: "pages",
          localField: "pageId",
          foreignField: "_id",
          as: "page",
        },
      },
      { $unwind: "$page" },
      {
        $group: {
          _id: "$page.bookUUID",
          versions: { $sum: 1 },
          contributors: { $addToSet: "$authorId" },
          languages: { $addToSet: "$language" },
        },
      },
    ]),
    VivarPost.countDocuments(),
  ])

  const multiVersionBooks = multiVersionResult[0]?.count || 0
  const versionStatsByBook = new Map(
    pageVersionsByBook.map((item: { _id: string; versions: number; contributors: unknown[]; languages: string[] }) => [
      item._id,
      item,
    ])
  )

  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  const blockedUsers = await User.countDocuments({ isBlocked: true })

  return {
    summary: {
      totalBooks,
      totalUsers,
      totalPages,
      totalVersions,
      multiVersionBooks,
      totalLanguages: booksByLanguage.length,
      blockedUsers,
      vivarPosts,
    },
    booksByLanguage: booksByLanguage.map((item: { _id: string; count: number }) => ({
      language: item._id || "Unknown",
      count: item.count,
    })),
    recentBooks: recentBooks.map((book) => ({
      ...(() => {
        const stats = versionStatsByBook.get(book.uuid)
        return {
          _id: String(book._id),
          title: book.title,
          author: book.author,
          originalLanguage: book.originalLanguage,
          uuid: book.uuid,
          coverURI: book.coverURI,
          pages: book.pages?.length || 0,
          versions: stats?.versions || 0,
          contributors: stats?.contributors?.filter(Boolean).length || 0,
          translatedLanguages: stats?.languages?.filter(Boolean) || [],
          genre: book.genre,
        }
      })()
    })),
    topAuthors: topAuthors.map((item: { _id: string; count: number }) => ({
      author: item._id || "Unknown",
      count: item.count,
    })),
    monthlyBooks: monthlyBooks.map((item: { _id: { month: number; year: number }; count: number }) => ({
      month: monthLabel(item._id.month - 1),
      year: item._id.year,
      count: item.count,
    })),
    usersByRole: usersByRole.map((item: { _id: string; count: number }) => ({
      role: item._id || "unknown",
      count: item.count,
    })),
  }
}
