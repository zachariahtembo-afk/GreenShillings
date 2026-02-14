import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

export function getClient() {
  if (!projectId) {
    throw new Error(
      'Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable'
    );
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  });
}

export function getPreviewClient() {
  if (!projectId) {
    throw new Error(
      'Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable'
    );
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });
}
