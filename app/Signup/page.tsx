"use client";

import { useAuth } from "@/modules/auth/contexts/authContext";
import Link from "next/link";
import { useState, JSX } from "react";

export default function LoginCard(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [password, setPassword] = useState<string>("");
  const {signup} = useAuth()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    signup(email,password,username)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/*Username*/}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
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
              className="block text-sm font-medium text-gray-700"
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
              className="block text-sm font-medium text-gray-700"
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
            className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Signup
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Already registered?{" "}
          <Link href="/Login" className="text-blue-600 hover:underline">
            Login up
          </Link>
        </div>
      </div>
    </div>
  );
}
