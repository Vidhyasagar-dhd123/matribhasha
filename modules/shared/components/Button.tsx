import * as React from "react";
import { cn } from "@/lib/utils";
const variants = {
  default:
    "bg-blue-600 primary-grad primary-grad-hover hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-300",
  outline:
    "border border-blue-500 text-blue-500 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-gray-200",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition focus:outline-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
