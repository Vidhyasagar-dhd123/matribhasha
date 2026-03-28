import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const truncateString = (str:string, num:number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const idToHeading = (id:string) => {
  return id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const headingToId = (heading:string) => {
  return heading
    .toLowerCase()
    .replace(/\s+/g, "-");
}