import * as React from "react";
import { cn } from "@/lib/utils";


export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "px-4 py-2  rounded-full border  font-medium transition focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
