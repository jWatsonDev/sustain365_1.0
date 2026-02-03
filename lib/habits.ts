import { Habit } from "@prisma/client";

export const HABITS: { id: Habit; label: string; icon: string }[] = [
  { id: "PRAYER", label: "Prayer / Meditation", icon: "🙏" },
  { id: "BIBLE", label: "Read Bible", icon: "📖" },
  { id: "READ_NONFICTION", label: "Read 5 Pages Nonfiction", icon: "📚" },
  { id: "WORKOUT", label: "Workout", icon: "💪" },
  { id: "WATER", label: "Drink 64oz Water", icon: "💧" },
  { id: "DIET", label: "Follow Diet", icon: "🥗" },
];

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getCurrentWeekStart(): Date {
  return getMonday(new Date());
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isFutureDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate > today;
}

// Parse a date string as local date, not UTC
// Handles both "YYYY-MM-DD" and ISO timestamp formats
export function parseLocalDate(dateStr: string): Date {
  // Extract just the date part (handles both "2026-02-03" and "2026-02-03T00:00:00.000Z")
  const datePart = dateStr.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  return new Date(year, month - 1, day);
}
