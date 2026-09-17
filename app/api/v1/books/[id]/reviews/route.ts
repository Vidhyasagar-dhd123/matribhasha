import connection from "@/lib/database";
import Book from "@/modules/books/models/Book.model";
import Review from "@/modules/books/models/Review.model";
import authenticateUser from "@/lib/auth";
import { z } from "zod";
import mongoose from "mongoose";

const ReviewCreateSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(120).optional().default(""),
  comment: z.string().min(2, "Review comment is required").max(3000),
  language: z.string().optional().default(""),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connection();

    const reviews = await Review.find({ bookUUID: id })
      .sort({ createdAt: -1 })
      .populate("userId", "name username email _id")
      .lean();

    const totalReviews = reviews.length;
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;

    for (const r of reviews) {
      const star = Math.min(5, Math.max(1, r.rating));
      distribution[star] = (distribution[star] || 0) + 1;
      ratingSum += star;
    }

    const averageRating = totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : 0;

    return Response.json(
      {
        reviews,
        stats: {
          averageRating,
          totalReviews,
          distribution,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Unauthorized. Please sign in to review." }, { status: 401 });
    }

    const { id } = await params;
    const json = await req.json();
    const parsed = ReviewCreateSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid review data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    await connection();

    // Verify book exists
    const book = await Book.findOne({ uuid: id });
    if (!book) {
      return Response.json({ message: "Book Not Found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(currentUser.id);
    const { rating, title, comment, language } = parsed.data;

    const review = await Review.findOneAndUpdate(
      {
        bookUUID: id,
        userId,
      },
      {
        $set: {
          rating,
          title,
          comment,
          language: language || book.originalLanguage || "",
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    ).populate("userId", "name username email _id");

    return Response.json(
      {
        message: "Review submitted successfully",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
