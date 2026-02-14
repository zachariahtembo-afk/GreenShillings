import { createClient } from '@sanity/client';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

// Server-side Sanity client with write access
const sanityAdmin = SANITY_PROJECT_ID && SANITY_API_TOKEN
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: '2024-01-01',
      useCdn: false,
      token: SANITY_API_TOKEN,
    })
  : null;

export interface InsightPayload {
  title: string;
  excerpt: string;
  body: Array<{
    _type: 'block';
    children: Array<{ _type: 'span'; text: string }>;
  }>;
  categorySlug?: string;
  tags?: string[];
  publishedAt?: string;
}

// Create an insight document in Sanity (used by Databricks webhook)
export async function createInsight(payload: InsightPayload) {
  if (!sanityAdmin) {
    throw new Error('Sanity admin client not configured. Set SANITY_PROJECT_ID and SANITY_API_TOKEN.');
  }

  const slug = payload.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96);

  const doc = {
    _type: 'insight',
    title: payload.title,
    slug: { _type: 'slug', current: slug },
    excerpt: payload.excerpt,
    body: payload.body,
    tags: payload.tags || [],
    publishedAt: payload.publishedAt || new Date().toISOString(),
    source: 'databricks',
    featured: false,
  };

  const result = await sanityAdmin.create(doc);
  return result;
}

// Check if Sanity admin is configured
export function isSanityAdminConfigured(): boolean {
  return Boolean(sanityAdmin);
}
