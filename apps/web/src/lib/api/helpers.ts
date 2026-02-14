import type {
  DocumentStatus,
  DocumentVisibility,
  NotificationChannel as PrismaNotificationChannel,
  MilestoneType as PrismaMilestoneType,
} from '@prisma/client';

export const optionalString = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const optionalNumber = (value: unknown) => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

export const parseStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((entry): entry is string => typeof entry === 'string')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length)
    : [];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const sanitizeFileName = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, '_');

export const VALID_DOCUMENT_STATUSES: DocumentStatus[] = ['DRAFT', 'REVIEW', 'FINAL', 'ARCHIVED'];
export const VALID_DOCUMENT_VISIBILITY: DocumentVisibility[] = ['SELECTED', 'ORGANIZATION', 'PUBLIC'];

export const VALID_CHANNELS = ['EMAIL', 'SMS', 'WHATSAPP', 'ALL'] as const;
export const VALID_MILESTONE_TYPES = [
  'TREES_PLANTED',
  'HECTARES_RESTORED',
  'COMMUNITY_TRAINED',
  'CARBON_VERIFIED',
  'HARVEST_COMPLETED',
  'PAYMENT_DISTRIBUTED',
  'MONITORING_COMPLETE',
  'CUSTOM',
] as const;

export const isValidChannel = (value: unknown): value is PrismaNotificationChannel =>
  typeof value === 'string' &&
  VALID_CHANNELS.includes(value.toUpperCase() as PrismaNotificationChannel);

export const isValidMilestoneType = (value: unknown): value is PrismaMilestoneType =>
  typeof value === 'string' &&
  VALID_MILESTONE_TYPES.includes(value.toUpperCase() as PrismaMilestoneType);

export const parseDocumentStatus = (value?: string): DocumentStatus | undefined => {
  if (!value) return undefined;
  const normalized = value.toUpperCase() as DocumentStatus;
  return VALID_DOCUMENT_STATUSES.includes(normalized) ? normalized : undefined;
};

export const parseDocumentVisibility = (value?: string): DocumentVisibility | undefined => {
  if (!value) return undefined;
  const normalized = value.toUpperCase() as DocumentVisibility;
  return VALID_DOCUMENT_VISIBILITY.includes(normalized) ? normalized : undefined;
};

/**
 * Format a phone number with country code (defaults to Tanzania +255)
 */
export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');

  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('0')) {
      cleaned = '+255' + cleaned.substring(1);
    } else if (cleaned.length === 9) {
      cleaned = '+255' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }

  return cleaned;
}
