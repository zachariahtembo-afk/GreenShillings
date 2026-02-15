'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Lightbulb, TrendingUp } from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { InsightCard } from '../../../components/insight-card';
import type { InsightCardData } from '../../../components/insight-card';
import { useLanguage } from '../../../lib/i18n/language-context';

interface InsightsContentProps {
  insights: InsightCardData[];
}

export function InsightsContent({ insights }: InsightsContentProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero Section */}
      <section className="relative bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6" data-hero>
                <span className="h-2 w-2 rounded-full bg-leaf" />
                <span className="section-label-light">{t.insights.sectionLabel}</span>
              </div>

              <h1
                className="mb-6 text-white text-balance max-w-2xl text-4xl md:text-5xl lg:text-6xl"
                data-hero
              >
                {t.insights.heroHeadline}
              </h1>

              <p
                className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-prose"
                data-hero
              >
                {t.insights.heroDescription}
              </p>
            </div>
          </HeroSequence>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-10 md:py-14 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: BarChart3,
                stat: '<5%',
                label: t.insights.stat1Label,
              },
              {
                icon: TrendingUp,
                stat: '$2B+',
                label: t.insights.stat2Label,
              },
              {
                icon: Lightbulb,
                stat: '90%',
                label: t.insights.stat3Label,
              },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-leaf" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-semibold text-leaf mb-1">{item.stat}</p>
                    <p className="text-sm text-white/70">{item.label}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Insights Grid */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.insights.latestInsights}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">
              {t.insights.researchAndAnalysis}
            </h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {insights.map((insight) => (
              <StaggerItem key={insight._id}>
                <InsightCard insight={insight} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="mb-6 text-ink max-w-2xl mx-auto">
              {t.insights.wantResearch}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-charcoal/70 max-w-prose mx-auto mb-8">
              {t.insights.stayInformed}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                {t.insights.getInTouch}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link href="/work" className="btn-ghost">
                {t.insights.viewAdvocacy}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
