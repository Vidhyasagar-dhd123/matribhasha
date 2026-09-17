import connection from "@/lib/database";
import User from "@/modules/user/models/user.model";
import authenticateUser from "@/lib/auth";
import { z } from "zod";

const ProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().max(1000).optional(),
  languages: z
    .array(
      z.object({
        name: z.string().min(1),
      })
    )
    .optional(),
});

export async function PUT(req: Request) {
  try {
    const currentUser = await authenticateUser(req);
    if (!currentUser) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = ProfileUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid profile data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    await connection();
    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      { $set: parsed.data },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
