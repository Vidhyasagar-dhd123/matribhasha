import connection from "@/lib/database";
import User from "@/modules/user/models/user.model";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connection()
    const { id } = await params;

    // Find the user
    const user = await User.findById(id);
    if (!user)
      return Response.json({ message: "User not found" }, { status: 404 });
    console.log("Current status:", user);
    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {$set: {isBlocked: !user.isBlocked} },
      { new: true }
    );

    if (!updatedUser)
      return Response.json(
        { message: "Something went wrong. Please try again!" },
        { status: 500 }
      );

    return Response.json(
      {
        message: `User ${updatedUser.isBlocked ? "blocked" : "unblocked"} successfully!`,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error at blocking user:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
