/**
 * Native date formatting utilities using Intl API
 * Replacement for date-fns to reduce bundle size
 */

type DateInput = string | Date;

const toDate = (date: DateInput): Date => {
  return typeof date === "string" ? new Date(date) : date;
};

export const formatDate = {
  /**
   * Format: "Jan 15, 2024" (similar to date-fns "PP")
   * @param date - Date string or Date object
   */
  medium: (date: DateInput): string => {
    const d = toDate(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  },

  /**
   * Format: "January 15, 2024" (similar to date-fns "PPP")
   * @param date - Date string or Date object
   */
  long: (date: DateInput): string => {
    const d = toDate(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  },

  /**
   * Format: "01/15/2024" (similar to date-fns "P")
   * @param date - Date string or Date object
   */
  short: (date: DateInput): string => {
    const d = toDate(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  },

  /**
   * Format: "3:45 PM" (similar to date-fns "p")
   * @param date - Date string or Date object
   */
  time: (date: DateInput): string => {
    const d = toDate(date);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  },

  /**
   * Format: "15:45" (24-hour format for HTML time input)
   * @param date - Date string or Date object
   */
  time24: (date: DateInput): string => {
    const d = toDate(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  },

  /**
   * Format: "Jan 15, 2024 - 3:45 PM"
   * @param date - Date string or Date object
   */
  datetime: (date: DateInput): string => {
    const d = toDate(date);
    return `${formatDate.medium(d)} ${formatDate.time(d)}`;
  },
  /**
   * Format: "2024-01-15" (ISO date format)
   * @param date - Date string or Date object
   */
  iso: (date: DateInput): string => {
    const d = toDate(date);
    return d.toISOString().split("T")[0];
  },
};

/**
 * Check if a date is valid
 * @param date - Date to validate
 */
export const isValid = (date: unknown): boolean => {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  if (typeof date === "string" || typeof date === "number") {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }
  return false;
};
