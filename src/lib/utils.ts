import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(): string {
  return `IDT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "ACCEPTED":
      return "text-green-500 bg-green-500/10 border-green-500/20";
    case "REJECTED":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "PENDING":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    default:
      return "text-gray-500 bg-gray-500/10 border-gray-500/20";
  }
}
