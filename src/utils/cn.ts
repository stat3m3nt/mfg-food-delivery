/**
 * Utility to merge Tailwind classes safely, resolving conflicts.
 * Usage: cn('px-4 py-2', isActive && 'bg-black', className)
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}