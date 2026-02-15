'use client';

import Link from 'next/link';
import { ArrowRight, Handshake, Shield, Globe2, Users, LineChart } from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { Card } from '../../../components/ui/card';
import { useLanguage } from '../../../lib/i18n/language-context';

export default function PartnersPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero */}
      <section className="relative bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6" data-hero>
                <span className="h-2 w-2 rounded-full bg-leaf" />
                <span className="section-label-light">{t.partners.sectionLabel}</span>
              </div>

              <h1 className="mb-6 text-white text-balance text-4xl md:text-5xl lg:text-6xl" data-hero>
                {t.partners.heroHeadline}
              </h1>

              <p
                className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-prose"
                data-hero
              >
                {t.partners.heroDescription}
              </p>

              <div className="flex flex-wrap gap-4" data-hero>
                <Link href="/contact" className="btn-primary">
                  {t.partners.startPartnership}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <Link href="/donate" className="btn-secondary">
                  {t.partners.supportPilotPhase}
                </Link>
              </div>
            </div>
          </HeroSequence>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-leaf/70 mb-3">{t.partners.partnerFocus}</p>
              <p className="text-2xl md:text-3xl font-display text-white">{t.partners.integrityAndAccountability}</p>
            </div>
            <p className="text-sm text-white/70 max-w-md">
              {t.partners.integrityAndAccountabilityDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Why Africa capture is low */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.partners.whyPartnerNow}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-8 text-ink max-w-2xl">
              {t.partners.globalCarbonFinance}
            </h2>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card variant="default" padding="lg" className="bg-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-tint border border-forest/10 text-forest flex items-center justify-center">
                  <Globe2 className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-forest mb-3">{t.partners.infrastructureGap}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t.partners.infrastructureGapDesc}
                  </p>
                </div>
              </div>
            </Card>
            <Card variant="default" padding="lg" className="bg-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-leaf/12 border border-leaf/20 text-forest flex items-center justify-center">
                  <LineChart className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-forest mb-3">{t.partners.valueCaptureGap}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t.partners.valueCaptureGapDesc}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership paths */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.partners.whoWeWorkWith}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">
              {t.partners.collaborationPathways}
            </h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: Handshake,
                title: t.partners.fundersAndDonors,
                description: t.partners.fundersAndDonorsDesc,
              },
              {
                icon: Shield,
                title: t.partners.mrvAndVerification,
                description: t.partners.mrvAndVerificationDesc,
              },
              {
                icon: Users,
                title: t.partners.implementingPartners,
                description: t.partners.implementingPartnersDesc,
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <Card variant="default" padding="lg" className="h-full">
                  <item.icon className="h-6 w-6 text-forest mb-5" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="text-lg text-forest mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-prose">
                    {item.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">
              {t.partners.scheduleBriefing}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/pilot-phase" className="btn-secondary">
              {t.partners.pilotPhaseOverview}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
