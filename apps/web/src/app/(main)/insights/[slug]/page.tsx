import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInsightBySlug } from '../../../../sanity/queries';
import InsightDetailContent from './insight-detail-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const insight = await getInsightBySlug(slug);
    if (!insight) return { title: 'Insight Not Found' };
    return {
      title: insight.title,
      description: insight.excerpt,
    };
  } catch {
    return { title: 'Insight Not Found' };
  }
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const insight = await getInsightBySlug(slug);
    if (!insight) notFound();
    return <InsightDetailContent insight={insight} />;
  } catch {
    notFound();
  }
}
