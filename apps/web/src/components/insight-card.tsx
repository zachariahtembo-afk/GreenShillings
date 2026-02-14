import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';

export type InsightCardData = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  coverImage?: { asset: { _ref: string }; alt?: string };
  publishedAt: string;
  categoryTitle?: string;
  authorName?: string;
  source?: 'manual' | 'databricks';
};

interface InsightCardProps {
  insight: InsightCardData;
}

export function InsightCard({ insight }: InsightCardProps) {
  const date = new Date(insight.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/insights/${insight.slug.current}`} className="group block h-full">
      <Card variant="outlined" padding="none" className="h-full bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-forest via-forest/70 to-forest/30" />
        <div className="p-6 lg:p-8 flex flex-col h-[calc(100%-6px)]">
          {insight.categoryTitle && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest/80 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
              {insight.categoryTitle}
            </span>
          )}
          <h3 className="text-lg font-display font-semibold text-charcoal mb-3 group-hover:text-forest transition-colors leading-snug">
            {insight.title}
          </h3>
          <p className="text-sm text-charcoal/60 leading-relaxed mb-4 line-clamp-3">
            {insight.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-charcoal/8">
            <div className="flex items-center gap-2 text-xs text-charcoal/50">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{date}</span>
              {insight.authorName && (
                <>
                  <span className="text-charcoal/30">|</span>
                  <span>{insight.authorName}</span>
                </>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-forest/50 group-hover:text-forest group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
