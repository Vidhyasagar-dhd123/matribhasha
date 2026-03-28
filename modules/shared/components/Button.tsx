import * as React from "react";
import { cn } from "@/lib/utils";
const variants = {
  default:
    "bg-primary text-primary-foreground hover:bg-accent focus:ring-2 focus:ring-blue-300 hover:",
  outline:
    "border    hover: focus:ring-2 focus:ring-[var(--accent-hover)]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg cursor-pointer  font-medium transition focus:outline-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
