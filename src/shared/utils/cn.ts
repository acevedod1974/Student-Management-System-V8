/**
 * Utility for conditionally joining CSS class names together
 *
 * Based on the `clsx` and `tailwind-merge` libraries for optimal class merging
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names together and handles Tailwind class conflicts
 *
 * @param inputs - CSS class name values to merge
 * @returns Merged class string with resolved Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
