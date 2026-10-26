import connection from "@/lib/database";
import User from "@/modules/user/models/user.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";
import authenticateUser, { canAccessUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    await connection();

    const currentUser = await authenticateUser(req);

    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    }).select("-password");

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Find all PageVersions authored by this user
    const pageVersions = await PageVersion.find({ authorId: user._id })
      .populate({
        path: "pageId",
        select: "bookUUID pageNumber originalLanguage",
      })
      .lean();

    // Extract unique book UUIDs
    const bookUUIDs = Array.from(
      new Set(
        pageVersions
          .map((pv) => (pv.pageId as unknown as { bookUUID?: string })?.bookUUID)
          .filter(Boolean)
      )
    );

    // Fetch book summaries
    const books = await Book.find({ uuid: { $in: bookUUIDs } })
      .select("title author originalLanguage uuid coverURI genre")
      .lean();

    const translatedLanguages = Array.from(
      new Set(pageVersions.map((pv) => pv.language).filter(Boolean))
    );

    const isAuthorizedForPrivateInfo = canAccessUser(currentUser, String(user._id));

    return Response.json(
      {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          ...(isAuthorizedForPrivateInfo ? { email: user.email } : {}),
          bio: user.bio || "",
          languages: user.languages || [],
          role: user.role,
          createdAt: user.createdAt,
        },
        stats: {
          contributedPages: pageVersions.length,
          contributedBooks: books.length,
          languagesCount: translatedLanguages.length || (user.languages?.length ?? 1),
          translatedLanguages,
        },
        contributedBooks: books,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
