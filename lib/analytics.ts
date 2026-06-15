import connection from "@/lib/database"
import Book from "@/modules/books/models/Book.model"
import Page from "@/modules/books/models/Pages.model"
import PageVersion from "@/modules/books/models/PageVersion.model"
import User from "@/modules/user/models/user.model"

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
  ] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments(),
    Page.countDocuments(),
    PageVersion.countDocuments(),
    Book.aggregate([
      { $group: { _id: "$originalLanguage", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
    Book.find().sort({ createdAt: -1 }).limit(6).select("title author originalLanguage uuid coverURI createdAt pages versions genre"),
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
    Book.aggregate([
      {
        $project: {
          versionsCount: { $size: { $ifNull: ["$versions", []] } },
        },
      },
      { $match: { versionsCount: { $gt: 1 } } },
      { $count: "count" },
    ]),
  ])

  const multiVersionBooks = multiVersionResult[0]?.count || 0

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
    },
    booksByLanguage: booksByLanguage.map((item: { _id: string; count: number }) => ({
      language: item._id || "Unknown",
      count: item.count,
    })),
    recentBooks: recentBooks.map((book) => ({
      _id: String(book._id),
      title: book.title,
      author: book.author,
      originalLanguage: book.originalLanguage,
      uuid: book.uuid,
      coverURI: book.coverURI,
      pages: book.pages?.length || 0,
      versions: book.versions?.length || 0,
      genre: book.genre,
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