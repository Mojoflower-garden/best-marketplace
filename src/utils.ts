import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function middleEllipses(str: string, startLength = 11, endLength = 5) {
  if (str && str.length > startLength + endLength + 4) {
    return (
      str.slice(0, startLength) +
      "..." +
      str.slice(str.length - endLength, str.length)
    );
  }
  return str;
}

export function formatTimeSince(date: Date): string {
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 7) {
    // If it's been more than a week, return the date in "dd-MM-yyyy" format
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } else if (days > 1) {
    return `${days} days`;
  } else if (days === 1) {
    return "1 day";
  } else if (hours > 1) {
    return `${hours} hours`;
  } else if (hours === 1) {
    return "1 hour";
  } else if (minutes > 1) {
    return `${minutes} minutes`;
  } else if (minutes === 1) {
    return "1 minute";
  } else {
    return "just now";
  }
}
