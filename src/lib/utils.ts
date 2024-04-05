import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { lucia } from "./auth";
import { cookies } from "next/headers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
