'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { HeroSequence, Reveal } from '../../../../components/motion';
import { urlFor } from '../../../../sanity/image';

interface InsightDetail {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  coverImage?: { asset: { _ref: string }; alt?: string };
  publishedAt: string;
  featured?: boolean;
  source?: string;
  tags?: string[];
  categoryTitle?: string;
  categorySlug?: string;
  authorName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authorImage?: any;
  authorBio?: string;
  authorRole?: string;
}

export default function InsightDetailContent({
  insight,
}: {
  insight: InsightDetail;
}) {
  const formattedDate = new Date(insight.publishedAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Header Section */}
      <section className="relative bg-white text-charcoal">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-14 md:py-18 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            {/* Back link */}
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest mb-8 transition-colors"
              data-hero
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Insights
            </Link>

            {/* Category badge */}
            {insight.categoryTitle && (
              <div
                className="flex items-center gap-3 mb-4 text-forest/70"
                data-hero
              >
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-forest/80 bg-green-tint px-3 py-1 rounded-full">
                  {insight.categoryTitle}
                </span>
              </div>
            )}

            {/* Title */}
            <h1
              className="mb-6 text-ink text-balance max-w-2xl text-3xl md:text-4xl lg:text-5xl"
              data-hero
            >
              {insight.title}
            </h1>

            {/* Metadata row */}
            <div
              className="flex items-center gap-4 text-sm text-charcoal/60 mb-8"
              data-hero
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>{formattedDate}</span>
              </div>
              {insight.authorName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span>{insight.authorName}</span>
                </div>
              )}
              {insight.tags && insight.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" aria-hidden="true" />
                  <span>{insight.tags[0]}</span>
                </div>
              )}
            </div>
          </HeroSequence>

          {/* Cover image */}
          {insight.coverImage && (
            <Reveal>
              <div className="mt-8 rounded-2xl overflow-hidden">
                <Image
                  src={urlFor(insight.coverImage)
                    .width(1200)
                    .height(630)
                    .url()}
                  alt={insight.coverImage.alt || insight.title}
                  width={1200}
                  height={630}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Body Section */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Portable Text body */}
          <Reveal>
            <div className="prose prose-lg prose-green max-w-none">
              {insight.body ? (
                <PortableText value={insight.body} />
              ) : (
                <p className="text-charcoal/70">
                  Full article content coming soon.
                </p>
              )}
            </div>
          </Reveal>

          {/* Tags section */}
          {insight.tags && insight.tags.length > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-12 pt-8 border-t border-charcoal/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag
                    className="h-4 w-4 text-forest/60"
                    aria-hidden="true"
                  />
                  {insight.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-forest/80 bg-green-tint px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Bottom back link */}
          <Reveal delay={0.2}>
            <div className="mt-12 pt-8 border-t border-charcoal/10">
              <Link href="/insights" className="btn-ghost">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to all insights
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
