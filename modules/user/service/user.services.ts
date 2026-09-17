import User from "../models/user.model";
import connection from "@/lib/database";

interface UserType {
  name?: string;
  username: string;
  email: string;
  password: string;
}

export async function createUser(userData: UserType) {
  const { name, username, email, password } = userData;
  await connection();
  const user = new User({
    name: name || username,
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password,
  });
  const response = await user.save();
  return response;
}