'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Scale, Users, FileCheck, Shield, Globe2, Handshake } from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { Pillars } from '../../../components/pillars';
import { StatsGrid } from '../../../components/stats-grid';
import { Card, CardGrid } from '../../../components/ui/card';
import { useLanguage } from '../../../lib/i18n/language-context';

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = 0.6;
  }, []);

  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute z-0 w-full h-full object-cover"
          src="https://greenshilling.s3.ap-southeast-2.amazonaws.com/Hero-village-small.mp4"
        />
        <div className="absolute inset-0 z-10 bg-black/50" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 w-full">
          <HeroSequence className="max-w-3xl">
            <div>
              <h1 className="mb-10 text-balance text-white" data-hero>
                {t.home.heroHeadline}
              </h1>

              <div className="flex flex-wrap gap-4" data-hero>
                <Link href="/pilot-phase" className="btn-primary">
                  {t.home.explorePilot}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </HeroSequence>
        </div>
      </section>

      <section id="pillars" className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.home.twoPillars}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-10 text-foreground max-w-2xl">
              {t.home.advocacyNowPilot}
            </h2>
          </Reveal>
          <Pillars
            items={[
              {
                title: t.home.advocacy.title,
                status: t.home.advocacy.status,
                description: t.home.advocacy.description,
                bullets: [...t.home.advocacy.bullets],
                href: '/work',
                ctaLabel: t.home.advocacy.ctaLabel,
                tone: 'active',
              },
              {
                title: t.home.pilotPhase.title,
                status: t.home.pilotPhase.status,
                description: t.home.pilotPhase.description,
                bullets: [...t.home.pilotPhase.bullets],
                href: '/pilot-phase',
                ctaLabel: t.home.pilotPhase.ctaLabel,
                tone: 'in-progress',
              },
            ]}
            className="gap-6"
          />
        </div>
      </section>

      {/* Why flows miss Africa */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.home.whyThisMatters}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-8 text-foreground max-w-2xl">
              {t.home.lessThan10}
            </h2>
          </Reveal>
          <CardGrid columns={2} className="gap-6">
            <Card variant="filled" padding="lg" className="bg-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-tint border border-forest/10 text-primary flex items-center justify-center">
                  <Globe2 className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-primary mb-3">{t.home.infrastructureGaps}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.home.infrastructureGapsDesc}
                  </p>
                </div>
              </div>
            </Card>
            <Card variant="filled" padding="lg" className="bg-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-leaf/12 border border-leaf/20 text-foreground flex items-center justify-center">
                  <Scale className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-primary mb-3">{t.home.valueCaptureMismatch}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.home.valueCaptureMismatchDesc}
                  </p>
                </div>
              </div>
            </Card>
          </CardGrid>
        </div>
      </section>

      {/* Locally led by design */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.home.locallyLed}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-foreground max-w-2xl">
              {t.home.communitiesLeadGovernance}
            </h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: Users,
                title: t.home.localGovernanceFirst,
                description: t.home.localGovernanceFirstDesc,
              },
              {
                icon: Shield,
                title: t.home.benefitSharingBuiltIn,
                description: t.home.benefitSharingBuiltInDesc,
              },
              {
                icon: FileCheck,
                title: t.home.evidenceYouCanVerify,
                description: t.home.evidenceYouCanVerifyDesc,
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <Card variant="default" padding="lg" className="h-full">
                  <item.icon className="h-6 w-6 text-primary mb-5" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="text-lg text-primary mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                    {item.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pilot phase snapshot */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.home.pilotPhaseSnapshot}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <h2 className="text-foreground max-w-2xl">
                {t.home.crediblePlan}
              </h2>
              <Link href="/pilot-phase" className="btn-secondary">
                {t.home.seePilotPhase}
              </Link>
            </div>
          </Reveal>

          <StatsGrid
            items={[
              {
                value: '2-4',
                label: t.home.pilotSitesTargeted,
              },
              {
                value: '12-18 Months',
                label: t.home.fromRegistrationToPayout,
              },
              {
                value: '>50%',
                label: t.home.targetCommunityRevenueShare,
              },
            ]}
            columns={3}
          />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/partners" className="btn-primary">
              {t.home.partnerWithUs}
              <Handshake className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/donate" className="btn-ghost">
              {t.home.supportThePilots}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
