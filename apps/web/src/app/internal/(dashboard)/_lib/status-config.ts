/**
 * Shared status/priority configuration for the internal portal.
 * Centralizes badge variants, labels, and formatters used across
 * dashboard, grants, organizations, and contacts pages.
 */

// --- Proposal Status ---

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  IN_REVIEW: 'In Review',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
};

export const STATUS_BADGE_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'info' | 'outline'> = {
  DRAFT: 'default',
  IN_REVIEW: 'warning',
  SUBMITTED: 'info',
  APPROVED: 'success',
  REJECTED: 'outline',
  ARCHIVED: 'default',
};

export const STATUS_BADGE_CLASS: Record<string, string> = {
  REJECTED: 'border-red-300 text-red-600',
};

// --- Priority ---

export const PRIORITY_BADGE_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'info' | 'outline'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'outline',
};

export const PRIORITY_BADGE_CLASS: Record<string, string> = {
  high: 'border-orange-300 text-orange-700 bg-orange-50',
  urgent: 'border-red-300 text-red-700 bg-red-50',
};

// --- Interaction Types ---

export const INTERACTION_BADGE_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'info' | 'outline'> = {
  MEETING: 'info',
  CALL: 'warning',
  EMAIL: 'success',
  NOTE: 'default',
};

// --- Formatters ---

export function formatCurrency(amount: number | null, currency: string): string {
  if (amount == null) return '\u2014';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '\u2014';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null): string {
  if (!date) return '\u2014';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatLabel(value: string): string {
  return value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
