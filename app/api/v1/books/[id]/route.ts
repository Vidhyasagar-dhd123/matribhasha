import Book from "@/modules/books/models/Book.model";
import connection from "@/lib/database";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import Review from "@/modules/books/models/Review.model";
import Chapter from "@/modules/books/models/Chapter.model";
import authenticateUser, { isAdminUser } from "@/lib/auth";
import { z } from "zod";

const BookUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  description: z.string().optional(),
  genre: z.string().optional(),
  isbn13: z.string().optional(),
  originalLanguage: z.string().optional(),
  coverURI: z.string().optional(),
  uploadURI: z.string().optional(),
  isTranslated: z.boolean().optional(),
  totalPages: z.number().int().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connection();
    const RequestedBook = await Book.findOne({ uuid: id });
    if (!RequestedBook) {
      return Response.json({ message: "Book Not Found" }, { status: 404 });
    }

    const pages = await Page.find({ bookUUID: id }).select("_id pageNumber");
    const pageIds = pages.map((page) => page._id);
    const totalPageCount = pages.length || RequestedBook.totalPages || 1;

    const [editionsData, languages, contributors, reviewAggregation] = await Promise.all([
      PageVersion.aggregate([
        { $match: { pageId: { $in: pageIds } } },
        {
          $group: {
            _id: { language: "$language", authorId: "$authorId" },
            translatedPages: { $sum: 1 },
            lastUpdated: { $max: "$updatedAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: { path: "$author", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            language: "$_id.language",
            authorId: "$_id.authorId",
            authorName: "$author.name",
            authorUsername: "$author.username",
            translatedPages: 1,
            completionPercent: {
              $min: [
                100,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$translatedPages", totalPageCount] },
                        100,
                      ],
                    },
                    0,
                  ],
                },
              ],
            },
            lastUpdated: 1,
          },
        },
        { $sort: { completionPercent: -1, lastUpdated: -1 } },
      ]),
      PageVersion.distinct("language", { pageId: { $in: pageIds } }),
      PageVersion.distinct("authorId", { pageId: { $in: pageIds } }),
      Review.aggregate([
        { $match: { bookUUID: id } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    const revStat = reviewAggregation[0];
    const averageRating = revStat?.averageRating ? Number(revStat.averageRating.toFixed(1)) : 0;
    const totalReviews = revStat?.totalReviews || 0;

    const book = RequestedBook.toObject();
    const versionCount = editionsData.length || (languages.length > 0 ? languages.length : 1);

    return Response.json(
      {
        ...book,
        pages: book.pages?.length ? book.pages : pageIds,
        totalPages: totalPageCount,
        editions: editionsData,
        versions: editionsData.map((e) => `${e.language || "Edition"} (${e.completionPercent}%)`),
        versionCount,
        contributors: contributors.filter(Boolean).length,
        translatedLanguages: Array.from(
          new Set([...(book.translatedLanguages || []), ...languages.filter(Boolean)])
        ),
        rating: averageRating,
        reviewsCount: totalReviews,
        reviews: totalReviews > 0 ? `${averageRating} (${totalReviews})` : undefined,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching book:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connection();

    const book = await Book.findOneAndDelete({ uuid: id });
    if (!book) {
      return Response.json({ message: "Book Not Found" }, { status: 404 });
    }

    // Clean up associated pages, page versions, and chapters
    const pages = await Page.find({
      $or: [{ bookId: book._id }, { bookUUID: id }],
    }).select("_id");
    const pageIds = pages.map((page) => page._id);

    await Promise.all([
      Page.deleteMany({ $or: [{ bookId: book._id }, { bookUUID: id }] }),
      PageVersion.deleteMany({ pageId: { $in: pageIds } }),
      Chapter.deleteMany({ bookUUID: id }),
    ]);

    return Response.json({ message: "Book Deleted Successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting book:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = BookUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid book update data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    await connection();
    const updatedBook = await Book.findOneAndUpdate(
      { uuid: id },
      { $set: parsed.data },
      { new: true }
    );

    if (!updatedBook) {
      return Response.json({ message: "Book Not Found" }, { status: 404 });
    }

    return Response.json(updatedBook, { status: 200 });
  } catch (err) {
    console.error("Error updating book:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
