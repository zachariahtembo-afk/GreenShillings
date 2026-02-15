'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Scale,
  Users,
  FileText,
  Megaphone,
  Globe2,
  AlertTriangle,
  TrendingDown,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { Card } from '../../../components/ui/card';
import { useLanguage } from '../../../lib/i18n/language-context';

export default function AdvocacyPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero — The Problem */}
      <section className="relative py-14 md:py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <HeroSequence className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-leaf/80 mb-4" data-hero>
              {t.work.theProblem}
            </p>
            <h1
              className="mb-6 text-white text-balance max-w-2xl text-4xl md:text-5xl lg:text-6xl"
              data-hero
            >
              {t.work.heroHeadline}
            </h1>
            <p className="text-white/70 max-w-prose mb-12 text-base md:text-lg" data-hero>
              {t.work.heroDescription}
            </p>
          </HeroSequence>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12" staggerDelay={0.08}>
            {[
              {
                stat: t.work.stat1,
                label: t.work.stat1Label,
                icon: TrendingDown,
              },
              {
                stat: t.work.stat2,
                label: t.work.stat2Label,
                icon: AlertTriangle,
              },
              {
                stat: t.work.stat3,
                label: t.work.stat3Label,
                icon: Globe2,
              },
              {
                stat: t.work.stat4,
                label: t.work.stat4Label,
                icon: Eye,
              },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <item.icon className="h-5 w-5 text-leaf mb-4" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-3xl font-display font-semibold text-leaf mb-2">{item.stat}</p>
                  <p className="text-sm text-white/60">{item.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal delay={0.2}>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-display font-semibold text-white mb-4">
                {t.work.howCashDrainWorks}
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-leaf mb-2">{t.work.knowledgeGap}</p>
                  <p className="text-sm text-white/60">
                    {t.work.knowledgeGapDesc}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-leaf mb-2">{t.work.exploitativeDeals}</p>
                  <p className="text-sm text-white/60">
                    {t.work.exploitativeDealsDesc}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-leaf mb-2">{t.work.noInfrastructure}</p>
                  <p className="text-sm text-white/60">
                    {t.work.noInfrastructureDesc}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GreenShilling's Solution */}
      <section className="py-14 md:py-20 bg-green-tint">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.work.ourSolution}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-6 text-ink max-w-2xl">
              {t.work.greenShillingCloseGap}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-charcoal/70 max-w-prose mb-12">
              {t.work.ourSolutionDesc}
            </p>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
            {[
              {
                icon: Eye,
                title: t.work.transparencyThroughInfo,
                description: t.work.transparencyThroughInfoDesc,
              },
              {
                icon: ShieldCheck,
                title: t.work.integrityInfrastructure,
                description: t.work.integrityInfrastructureDesc,
              },
              {
                icon: Users,
                title: t.work.communityEmpowerment,
                description: t.work.communityEmpowermentDesc,
              },
              {
                icon: Scale,
                title: t.work.policyAdvocacy,
                description: t.work.policyAdvocacyDesc,
              },
            ].map((item, i) => (
              <StaggerItem key={item.title}>
                <Card variant="outlined" padding="lg" className="bg-white h-full">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${i % 2 === 0 ? 'bg-green-tint border border-forest/10 text-forest' : 'bg-leaf/12 border border-leaf/20 text-forest'}`}>
                      <item.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest mb-2">{item.title}</h3>
                      <p className="text-sm text-charcoal/70 leading-relaxed max-w-prose">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-4 md:grid-cols-2">
          <Card variant="elevated" padding="lg" className="bg-forest text-white" animate>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-4">{t.work.advocacyFocus}</p>
            <p className="text-2xl font-display mb-2">{t.work.standardsPolicyTransparency}</p>
            <p className="text-sm text-white/80 max-w-prose">
              {t.work.advocacyFocusDesc}
            </p>
          </Card>
          <Card variant="default" padding="lg" className="bg-white" animate>
            <p className="text-xs uppercase tracking-[0.2em] text-forest/70 mb-3">{t.work.activeNow}</p>
            <p className="text-lg font-semibold text-forest mb-2">{t.work.standardsLiteracySessions}</p>
            <p className="text-sm text-charcoal/70 max-w-prose">
              {t.work.standardsLiteracySessionsDesc}
            </p>
          </Card>
        </div>
      </section>

      {/* What we do now */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.work.whatWeDoNow}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">
              {t.work.activeAdvocacy}
            </h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: BookOpen,
                title: t.work.standardsLiteracy,
                description: t.work.standardsLiteracyDesc,
              },
              {
                icon: Scale,
                title: t.work.policyAlignment,
                description: t.work.policyAlignmentDesc,
              },
              {
                icon: Users,
                title: t.work.partnerMobilization,
                description: t.work.partnerMobilizationDesc,
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
        </div>
      </section>

      {/* What we publish */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">{t.work.whatWePublish}</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">{t.work.evidencePacksAndGuidance}</h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: FileText,
                title: t.work.standardsBriefings,
                description: t.work.standardsBriefingsDesc,
              },
              {
                icon: Globe2,
                title: t.work.marketIntegrityNotes,
                description: t.work.marketIntegrityNotesDesc,
              },
              {
                icon: Megaphone,
                title: t.work.partnerMobilizationKits,
                description: t.work.partnerMobilizationKitsDesc,
              },
              {
                icon: Scale,
                title: t.work.communityEducationTools,
                description: t.work.communityEducationToolsDesc,
              },
            ].map((item, i) => (
              <Card key={item.title} variant="outlined" padding="lg" className="bg-chalk">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${i % 2 === 0 ? 'bg-white border border-forest/10 text-forest' : 'bg-leaf/12 border border-leaf/20 text-forest'}`}>
                    <item.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg text-forest mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-prose">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/partners" className="btn-primary">
              {t.work.requestEvidencePack}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/contact" className="btn-ghost">
              {t.work.contactTheTeam}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
