import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to display as "22 Jan '24" format
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  return `${day} ${month} '${year}`;
}

/**
 * Formats a date string to display time in 24-hour format
 * @param dateString - ISO date string or Date object
 * @returns Formatted time string in 24-hour format
 */
export function formatTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Formats a date string to display both date and time
 * @param dateString - ISO date string or Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | Date): string {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

/**
 * Formats a number as Indian Rupee currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₹1,23,456.78")
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Standard status badge configuration for success and error states
 */
export const statusBadgeConfig = {
  success: {
    className: "bg-green-100 text-green-800 border-green-200",
    icon: "CheckCircle" as const,
    text: "Success"
  },
  error: {
    className: "bg-red-100 text-red-800 border-red-200", 
    icon: "AlertTriangle" as const,
    text: "Error"
  },
  failed: {
    className: "bg-red-100 text-red-800 border-red-200",
    icon: "AlertTriangle" as const, 
    text: "Failed"
  }
} as const;
