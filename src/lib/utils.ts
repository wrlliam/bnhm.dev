import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearsAgo(pastDate: Date | string): number {
  const past = typeof pastDate === "string" ? new Date(pastDate) : pastDate;
  const today = new Date();

  const diffMs = today.getTime() - past.getTime();

  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const yearsAgo = diffMs / msPerYear;

  return yearsAgo;
}
