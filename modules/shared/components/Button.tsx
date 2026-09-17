import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring",
  outline:
    "border border-border text-foreground bg-background hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-ring",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-muted focus:ring-2 focus:ring-ring",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-2 focus:ring-ring",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
