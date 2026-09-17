import connection from "@/lib/database";
import authenticateUser, { isAdminUser } from "@/lib/auth";
import VivarPost from "@/modules/vivar/models/VivarPost.model";
import { z } from "zod";

const VivarUpdateSchema = z.object({
  caption: z.string().optional(),
  selectedText: z.string().min(1).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connection();

    const post = await VivarPost.findById(id).populate(
      "authorId",
      "name username email _id"
    );

    if (!post) {
      return Response.json({ message: "Post not found" }, { status: 404 });
    }

    const postObj = post.toObject();

    return Response.json(
      {
        ...postObj,
        likesCount: post.likes?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Vivar post:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = VivarUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: "Invalid payload", errors: parsed.error.format() }, { status: 400 });
    }

    await connection();

    const post = await VivarPost.findById(id);
    if (!post) {
      return Response.json({ message: "Post not found" }, { status: 404 });
    }

    const isAuthor = String(post.authorId) === String(currentUser.id);
    const isAdmin = isAdminUser(currentUser);

    if (!isAuthor && !isAdmin) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    if (parsed.data.caption !== undefined) post.caption = parsed.data.caption;
    if (parsed.data.selectedText !== undefined) post.selectedText = parsed.data.selectedText;

    await post.save();
    const populated = await post.populate("authorId", "name username email _id");

    return Response.json(
      {
        ...populated.toObject(),
        likesCount: populated.likes?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Vivar post:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connection();

    const post = await VivarPost.findById(id);
    if (!post) {
      return Response.json({ message: "Post not found" }, { status: 404 });
    }

    const isAuthor = String(post.authorId) === String(currentUser.id);
    const isAdmin = isAdminUser(currentUser);

    if (!isAuthor && !isAdmin) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    await VivarPost.findByIdAndDelete(id);
    return Response.json({ message: "Vivar post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Vivar post:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
