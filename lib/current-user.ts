import { NextRequest } from "next/server";
import { verifyJWT } from "@/modules/auth/utils/jwt";
import User from "@/modules/user/models/user.model";

type TokenPayload = {
  id?: string;
  username?: string;
};

export async function getCurrentUser(req: NextRequest | Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  const payload = verifyJWT<TokenPayload>(token);
  if (!payload?.id) return null;

  return User.findById(payload.id);
}
