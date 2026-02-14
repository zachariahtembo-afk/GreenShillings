import type { Metadata } from 'next';
import { getInsights } from '../../../sanity/queries';
import type { InsightCardData } from '../../../components/insight-card';
import { InsightsContent } from './insights-content';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Research, analysis, and stories from the front lines of climate finance in Africa.',
};

const placeholderInsights: InsightCardData[] = [
  {
    _id: '1',
    title: 'Africa receives less than 5% of global carbon credit revenue',
    slug: { current: 'africa-carbon-credit-gap' },
    excerpt:
      'Despite hosting some of the world\'s most critical carbon sinks, African nations receive a fraction of global carbon market revenue. This analysis explores the structural reasons behind the disparity.',
    publishedAt: '2025-01-15T00:00:00Z',
    categoryTitle: 'Market Analysis',
    authorName: 'GreenShillings Research',
    source: 'manual' as const,
  },
  {
    _id: '2',
    title: 'Community-led projects deliver 3x more lasting impact',
    slug: { current: 'community-led-impact' },
    excerpt:
      'Research shows that carbon projects designed and managed by local communities produce significantly more durable outcomes than externally managed alternatives.',
    publishedAt: '2025-01-10T00:00:00Z',
    categoryTitle: 'Research',
    authorName: 'GreenShillings Research',
    source: 'manual' as const,
  },
  {
    _id: '3',
    title: 'Tanzania\'s agroforestry potential: An untapped opportunity',
    slug: { current: 'tanzania-agroforestry-potential' },
    excerpt:
      'Tanzania\'s agricultural landscape presents a unique opportunity for carbon sequestration through agroforestry. Here\'s why the country is positioned to lead.',
    publishedAt: '2025-01-05T00:00:00Z',
    categoryTitle: 'Opportunity',
    authorName: 'GreenShillings Research',
    source: 'manual' as const,
  },
  {
    _id: '4',
    title: 'How information asymmetry drives exploitation in African carbon markets',
    slug: { current: 'information-asymmetry-exploitation' },
    excerpt:
      'Foreign entities with superior market knowledge are systematically extracting value from carbon projects in Africa. We examine the mechanisms and what can be done.',
    publishedAt: '2024-12-20T00:00:00Z',
    categoryTitle: 'Policy',
    authorName: 'GreenShillings Research',
    source: 'manual' as const,
  },
  {
    _id: '5',
    title: 'Verification standards: What African projects need to know',
    slug: { current: 'verification-standards-guide' },
    excerpt:
      'A practical guide to Verra VCS, Gold Standard, and Plan Vivo requirements for carbon projects in Sub-Saharan Africa.',
    publishedAt: '2024-12-15T00:00:00Z',
    categoryTitle: 'Standards',
    authorName: 'GreenShillings Research',
    source: 'manual' as const,
  },
  {
    _id: '6',
    title: 'The role of satellite verification in building trust',
    slug: { current: 'satellite-verification-trust' },
    excerpt:
      'How satellite imagery and AI-powered monitoring can close the accountability gap in carbon credit verification across the continent.',
    publishedAt: '2024-12-10T00:00:00Z',
    categoryTitle: 'Technology',
    authorName: 'GreenShillings Research',
    source: 'databricks' as const,
  },
];

export default async function InsightsPage() {
  let insights: InsightCardData[];

  try {
    const data = await getInsights();
    insights = data && data.length > 0 ? data : placeholderInsights;
  } catch {
    insights = placeholderInsights;
  }

  return <InsightsContent insights={insights} />;
}
