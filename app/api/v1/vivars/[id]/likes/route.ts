import connection from "@/lib/database";
import { getCurrentUser } from "@/lib/current-user";
import VivarPost from "@/modules/vivar/models/VivarPost.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connection();
    const user = await getCurrentUser(req);

    if (!user) {
      return Response.json({ message: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    const post = await VivarPost.findById(id);

    if (!post) {
      return Response.json({ message: "Post not found" }, { status: 404 });
    }

    const alreadyLiked = post.likes.some((likeId: { toString: () => string }) => likeId.toString() === user._id.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((likeId: { toString: () => string }) => likeId.toString() !== user._id.toString());
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    return Response.json(
      {
        liked: !alreadyLiked,
        likesCount: post.likes.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ message: "Something Went Wrong" }, { status: 500 });
  }
}
