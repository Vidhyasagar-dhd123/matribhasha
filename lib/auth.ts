import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload {
  id: string;
  username?: string;
  email?: string;
  role?: "user" | "admin" | string;
}

export function signJWT(payload: AuthTokenPayload, expiresIn: string | number = "7d"): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
}

export function verifyJWT<T extends object = AuthTokenPayload>(token: string): T | null {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.verify(token, jwtSecret) as T;
  } catch {
    return null;
  }
}

export async function authenticateUser(req: Request): Promise<AuthTokenPayload | null> {
  const bearerToken = req.headers.get("authorization");
  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return null;
  }

  const token = bearerToken.split(" ")[1]?.trim();
  if (!token) return null;

  return verifyJWT<AuthTokenPayload>(token);
}

export function isAdminUser(user: AuthTokenPayload | null | undefined): boolean {
  return user?.role === "admin";
}

export function canAccessUser(
  user: AuthTokenPayload | null | undefined,
  targetUserId: string
): boolean {
  if (!user) {
    return false;
  }

  return (
    isAdminUser(user) ||
    String(user.id) === String(targetUserId) ||
    String((user as { _id?: string })._id) === String(targetUserId)
  );
}

export default authenticateUser;
