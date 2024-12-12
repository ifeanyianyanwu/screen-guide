import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYear(date?: Date) {
  if (!date) return;
  const n = new Date(date);
  return n.getFullYear();
}
