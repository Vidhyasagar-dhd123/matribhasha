import connection from "@/lib/database";
import { signJWT } from "@/modules/auth/utils/jwt";
import { comparePassword } from "@/modules/auth/utils/password";
import User from "@/modules/user/models/user.model";
import { NextRequest } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    await connection();
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { message: result.error.issues[0]?.message || "Invalid credentials" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const identifier = email.toLowerCase().trim();

    const userExists = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!userExists) {
      return Response.json({ message: "No such user exists." }, { status: 404 });
    }

    const isMatch = await comparePassword(password, userExists.password);
    if (!isMatch) {
      return Response.json({ message: "Wrong password." }, { status: 400 });
    }

    if (userExists.isBlocked) {
      return Response.json({ message: "Account is blocked." }, { status: 403 });
    }

    const role = userExists.role || "user";
    const userId = String(userExists._id);
    const username = userExists.username || userExists.name;
    const token = signJWT({ id: userId, username, email: userExists.email, role });

    return Response.json(
      {
        user: {
          id: userId,
          _id: userId,
          name: userExists.name,
          username,
          email: userExists.email,
          role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login API error:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}