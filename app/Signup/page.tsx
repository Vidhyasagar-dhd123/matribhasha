"use client";

import { useAuth } from "@/modules/auth/contexts/authContext";
import Link from "next/link";
import { useEffect, useState, JSX } from "react";
import { useRouter } from "next/navigation";

export default function LoginCard(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [password, setPassword] = useState<string>("");
  const {signup, user} = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    signup(email,password,username)
  };

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [router, user])

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className=" p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="mb-6   font-bold">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/*Username*/}
          <div>
            <label
              htmlFor="username"
              className="block  font-medium "
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              placeholder="Username"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/*Email*/}
          <div>
            <label
              htmlFor="email"
              className="block  font-medium "
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/*Password*/}
          <div>
            <label
              htmlFor="password"
              className="block  font-medium "
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/*Confirm Password*/}
          <div>
            <input
              id="confirm"
              type="password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm Password"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded   font-semibold hover: focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={password !== confirmPassword}
          >
            Signup
          </button>
        </form>
        <div className="mt-4  ">
          Already registered?{" "}
          <Link href="/Login" className=" hover:underline">
            Login up
          </Link>
        </div>
      </div>
    </div>
  );
}
