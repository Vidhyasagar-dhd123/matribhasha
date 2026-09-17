import connection from "@/lib/database";
import Review from "@/modules/books/models/Review.model";
import authenticateUser, { isAdminUser } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, reviewId } = await params;
    await connection();

    const review = await Review.findById(reviewId);
    if (!review) {
      return Response.json({ message: "Review not found" }, { status: 404 });
    }

    const isAuthor = String(review.userId) === String(currentUser.id);
    const isAdmin = isAdminUser(currentUser);

    if (!isAuthor && !isAdmin) {
      return Response.json({ message: "Forbidden. You cannot delete this review." }, { status: 403 });
    }

    await Review.findByIdAndDelete(reviewId);

    return Response.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting review:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
