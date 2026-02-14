import { getClient } from './client';

// Insights
export async function getInsights(limit = 12) {
  return getClient().fetch(
    `*[_type == "insight"] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      featured,
      source,
      "categoryTitle": category->title,
      "categorySlug": category->slug.current,
      "authorName": author->name,
      "authorImage": author->image
    }`,
    { limit }
  );
}

export async function getFeaturedInsights() {
  return getClient().fetch(
    `*[_type == "insight" && featured == true] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      "categoryTitle": category->title
    }`
  );
}

export async function getInsightBySlug(slug: string) {
  return getClient().fetch(
    `*[_type == "insight" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body,
      coverImage,
      publishedAt,
      featured,
      source,
      tags,
      "categoryTitle": category->title,
      "categorySlug": category->slug.current,
      "authorName": author->name,
      "authorImage": author->image,
      "authorBio": author->bio,
      "authorRole": author->role
    }`,
    { slug }
  );
}

export async function getInsightsByCategory(categorySlug: string) {
  return getClient().fetch(
    `*[_type == "insight" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      "categoryTitle": category->title
    }`,
    { categorySlug }
  );
}

// Categories
export async function getCategories() {
  return getClient().fetch(
    `*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
  );
}

// Advocacy Content
export async function getAdvocacyContent() {
  return getClient().fetch(
    `*[_type == "advocacyContent"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      contentType,
      topic,
      audience,
      documentUrl,
      publishedAt
    }`
  );
}

// Project Updates
export async function getProjectUpdates(limit = 6) {
  return getClient().fetch(
    `*[_type == "projectUpdate"] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      slug,
      projectName,
      milestone,
      publishedAt
    }`,
    { limit }
  );
}

// Pillars
export async function getPillars() {
  return getClient().fetch(
    `*[_type == "pillar"] | order(priority asc) {
      _id,
      title,
      summary,
      icon,
      priority,
      body
    }`
  );
}
