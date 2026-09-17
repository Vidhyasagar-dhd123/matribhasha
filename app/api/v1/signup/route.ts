import { signJWT } from "@/modules/auth/utils/jwt";
import { hashPassword } from "@/modules/auth/utils/password";
import connection from "@/lib/database";
import User from "@/modules/user/models/user.model";
import { createUser } from "@/modules/user/service/user.services";
import { NextRequest } from "next/server";
import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(30),
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    await connection();
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { message: result.error.issues[0]?.message || "Invalid inputs" },
        { status: 400 }
      );
    }

    const { email, username, name, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return Response.json({ message: "An account with this email already exists." }, { status: 409 });
      }
      return Response.json({ message: "This username is already taken." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUser({
      name: name || username,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const userId = String(user._id);
    const role = user.role || "user";
    const token = signJWT({ id: userId, username: user.username, email: user.email, role });

    return Response.json(
      {
        user: {
          id: userId,
          _id: userId,
          name: user.name,
          username: user.username,
          email: user.email,
          role,
        },
        token,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
