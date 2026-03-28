"use client";

import Link from "next/link";
import { useState, JSX, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";

export default function LoginCard(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {user, login, logout} = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    login(email,password)
  };

  useEffect(()=>{
    if(user){
        router.push("/")
    }
  })

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className=" p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="mb-6   font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Username"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            />
          </div>
          <div className=" ">
            <Link href="/forgot-password" className=" hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded   font-semibold hover: focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <div className="mt-4  ">
          Don’t have an account?{" "}
          <Link href="/Signup" className=" hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
