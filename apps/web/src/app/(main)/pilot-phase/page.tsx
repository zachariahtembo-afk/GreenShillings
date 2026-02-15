'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardList, Users, Database, Wallet, Shield } from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { StatsGrid } from '../../../components/stats-grid';
import { Card } from '../../../components/ui/card';
import { useLanguage } from '../../../lib/i18n/language-context';

export default function PilotPhasePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero */}
      <section className="relative bg-chalk text-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-18 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6 text-forest/70" data-hero>
                <span className="h-2 w-2 rounded-full bg-citrus" />
                <span className="section-label">{t.pilotPhase.sectionLabel}</span>
              </div>

              <h1 className="mb-6 text-ink text-balance text-4xl md:text-5xl lg:text-6xl" data-hero>
                {t.pilotPhase.heroHeadline}
              </h1>

              <p
                className="text-base md:text-lg text-charcoal/70 leading-relaxed mb-8 max-w-prose"
                data-hero
              >
                {t.pilotPhase.heroDescription}
              </p>

              <div className="flex flex-wrap gap-4" data-hero>
                <Link href="/partners" className="btn-primary">
                  {t.pilotPhase.partnerWithPilots}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <Link href="/donate" className="btn-secondary">
                  {t.pilotPhase.supportPilotSetup}
                </Link>
              </div>
            </div>
          </HeroSequence>
        </div>
      </section>
      <div className="h-1 bg-gradient-to-r from-leaf via-leaf/60 to-transparent" />

      <section className="py-10 md:py-14 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-leaf/70 mb-3">{t.pilotPhase.status}</p>
              <p className="text-2xl md:text-3xl font-display text-white mb-2">{t.pilotPhase.registrationUnderway}</p>
              <p className="text-sm text-white/70 max-w-prose">
                {t.pilotPhase.registrationDesc}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                {t.pilotPhase.builtForIntegrity}
              </p>
              <p className="text-lg font-semibold text-white mb-2">{t.pilotPhase.evidenceFirstImpl}</p>
              <p className="text-sm text-white/70 max-w-prose">
                {t.pilotPhase.evidenceFirstImplDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we're building */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.pilotPhase.whatWeAreBuilding}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">{t.pilotPhase.pilotInfrastructure}</h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
            {[
              {
                icon: ClipboardList,
                title: t.pilotPhase.projectRegistration,
                description: t.pilotPhase.projectRegistrationDesc,
              },
              {
                icon: Users,
                title: t.pilotPhase.communityOnboarding,
                description: t.pilotPhase.communityOnboardingDesc,
              },
              {
                icon: Database,
                title: t.pilotPhase.mrvIntegrations,
                description: t.pilotPhase.mrvIntegrationsDesc,
              },
              {
                icon: Wallet,
                title: t.pilotPhase.payoutRails,
                description: t.pilotPhase.payoutRailsDesc,
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <Card variant="default" padding="lg" className="h-full">
                  <item.icon className="h-6 w-6 text-forest mb-4" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="text-lg text-forest mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-prose">
                    {item.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pilot targets */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.pilotPhase.pilotTargets}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-10 text-ink max-w-2xl">
              {t.pilotPhase.targetsForPilotPhase}
            </h2>
          </Reveal>

          <StatsGrid
            items={[
              {
                value: t.pilotPhase.pilotSites,
                label: t.pilotPhase.registrationTargets,
                note: t.pilotPhase.registrationTargetsNote,
              },
              {
                value: t.pilotPhase.communityCounsils,
                label: t.pilotPhase.localGovernanceStructures,
                note: t.pilotPhase.localGovernanceNote,
              },
              {
                value: t.pilotPhase.mrvReady,
                label: t.pilotPhase.verificationPartnerships,
                note: t.pilotPhase.verificationNote,
              },
            ]}
            columns={3}
          />
        </div>
      </section>

      {/* Locally led governance */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <Reveal>
                <p className="section-label mb-4">{t.pilotPhase.locallyLedGovernance}</p>
                <div className="divider-editorial mt-4" />
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mb-6 text-ink">
                  {t.pilotPhase.communitiesCaptureValue}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-gray-600 leading-relaxed max-w-prose">
                  {t.pilotPhase.locallyLedGovernanceDesc}
                </p>
              </Reveal>
            </div>
            <Card variant="default" padding="lg" className="bg-white" animate>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-leaf/12 border border-leaf/20 text-forest flex items-center justify-center">
                  <Shield className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-forest mb-2">{t.pilotPhase.integrityCheckpoints}</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li>{t.pilotPhase.checkpoint1}</li>
                    <li>{t.pilotPhase.checkpoint2}</li>
                    <li>{t.pilotPhase.checkpoint3}</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
