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

export default function AdvocacyPage() {
  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero — The Problem */}
      <section className="relative py-14 md:py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <HeroSequence className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-leaf/80 mb-4" data-hero>
              The problem
            </p>
            <h1
              className="mb-6 text-white text-balance max-w-2xl text-4xl md:text-5xl lg:text-6xl"
              data-hero
            >
              Information asymmetry is draining Africa&apos;s carbon wealth.
            </h1>
            <p className="text-white/70 max-w-prose mb-12 text-base md:text-lg" data-hero>
              The global carbon market is worth over $900 billion, yet African nations that host
              critical carbon sinks receive a fraction of the revenue. Foreign entities with
              superior market knowledge and established networks systematically extract value,
              leaving communities with little to show for the carbon they protect.
            </p>
          </HeroSequence>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12" staggerDelay={0.08}>
            {[
              {
                stat: '<5%',
                label: 'Of global carbon credit revenue reaches Africa',
                icon: TrendingDown,
              },
              {
                stat: '90%',
                label: 'Of benefits leave the communities where carbon is stored',
                icon: AlertTriangle,
              },
              {
                stat: '$2B+',
                label: 'Traded annually from African carbon projects',
                icon: Globe2,
              },
              {
                stat: '3x',
                label: 'More value captured by intermediaries than communities',
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
                How the cash drain works
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-leaf mb-2">Knowledge gap</p>
                  <p className="text-sm text-white/60">
                    Local communities and governments lack awareness of carbon credit markets, pricing
                    mechanisms, and their own negotiating power.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-leaf mb-2">Exploitative deals</p>
                  <p className="text-sm text-white/60">
                    Foreign developers sign long-term agreements at below-market rates, locking
                    communities into unfavorable terms for decades.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-leaf mb-2">No infrastructure</p>
                  <p className="text-sm text-white/60">
                    Without local verification, monitoring, and governance infrastructure, communities
                    cannot independently participate in carbon markets.
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
            <p className="section-label mb-4">Our solution</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-6 text-ink max-w-2xl">
              GreenShilling exists to close the gap.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-charcoal/70 max-w-prose mb-12">
              We build the infrastructure for accountability and integrity that African carbon
              markets are missing. By providing transparency, education, and community-centered
              governance, we ensure that the value of carbon stays where it belongs.
            </p>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
            {[
              {
                icon: Eye,
                title: 'Transparency through information',
                description:
                  'We provide communities with real-time market data, fair pricing benchmarks, and plain-language explanations of their rights and options.',
              },
              {
                icon: ShieldCheck,
                title: 'Integrity infrastructure',
                description:
                  'From verification to governance, we build the systems that make accountability the default, not an afterthought.',
              },
              {
                icon: Users,
                title: 'Community empowerment',
                description:
                  'Training community leaders to negotiate from a position of knowledge, ensuring they capture fair value from carbon projects on their land.',
              },
              {
                icon: Scale,
                title: 'Policy advocacy',
                description:
                  'Working with governments and standards bodies to reform the rules so they protect communities and promote equitable benefit sharing.',
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
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-4">Advocacy focus</p>
            <p className="text-2xl font-display mb-2">Standards, policy, and transparency</p>
            <p className="text-sm text-white/80 max-w-prose">
              We advocate for clear benefit-sharing rules and open evidence so communities can
              negotiate from a position of strength.
            </p>
          </Card>
          <Card variant="default" padding="lg" className="bg-white" animate>
            <p className="text-xs uppercase tracking-[0.2em] text-forest/70 mb-3">Active now</p>
            <p className="text-lg font-semibold text-forest mb-2">Standards literacy sessions</p>
            <p className="text-sm text-charcoal/70 max-w-prose">
              Workshops and briefing materials for community leaders, partners, and local
              stakeholders.
            </p>
          </Card>
        </div>
      </section>

      {/* What we do now */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">What we do now</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">
              Active advocacy to unlock fair market access.
            </h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: BookOpen,
                title: 'Standards literacy',
                description:
                  'Plain-language guidance on Verra, Gold Standard, and Plan Vivo requirements so partners and communities align early.',
              },
              {
                icon: Scale,
                title: 'Policy alignment',
                description:
                  'Briefings and feedback loops with policymakers and verification bodies to push for equity and transparency.',
              },
              {
                icon: Users,
                title: 'Partner mobilization',
                description:
                  'Convening donors, MRV providers, and implementers to build the missing infrastructure for Tanzania pilots.',
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
            <p className="section-label mb-4">What we publish</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">Evidence packs and guidance for partners.</h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: FileText,
                title: 'Standards briefings',
                description:
                  'Side-by-side summaries of major standards and what they mean for community governance and benefit sharing.',
              },
              {
                icon: Globe2,
                title: 'Market integrity notes',
                description:
                  'Position papers on fairness, transparency, and verification readiness for African projects.',
              },
              {
                icon: Megaphone,
                title: 'Partner mobilization kits',
                description:
                  'Clear requirements, pilot prep checklists, and collaboration pathways for funders and MRV teams.',
              },
              {
                icon: Scale,
                title: 'Community education tools',
                description:
                  'Workbooks and training sessions designed for local leaders to navigate carbon finance responsibly.',
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
              Request an evidence pack
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Contact the team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
