'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Users,
  ClipboardList,
  Satellite,
  BadgeCheck,
  Wallet,
  FileCheck,
  Scale,
} from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { QuoteBlock } from '../../../components/quote-block';
import { Card } from '../../../components/ui/card';

const steps = [
  {
    icon: Users,
    title: 'Community governance first',
    description:
      'Local leaders co-design governance, consent, and benefit-sharing terms before pilots launch.',
  },
  {
    icon: ClipboardList,
    title: 'Project registration',
    description:
      'We assemble baseline data, documentation, and risk checks to meet integrity standards.',
  },
  {
    icon: Satellite,
    title: 'MRV integration',
    description:
      'We prepare satellite + ground data pipelines with MRV partners for transparent reporting.',
  },
  {
    icon: BadgeCheck,
    title: 'Verification readiness',
    description: 'Evidence packs and audit trails are prepared for third-party verification.',
  },
  {
    icon: Wallet,
    title: 'Value sharing',
    description:
      'Funding flows are tracked so communities can see and approve how value is distributed.',
  },
];

export default function IntegrityPage() {
  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero */}
      <section className="relative bg-chalk text-charcoal border-b-2 border-forest/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-18 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6 text-forest/70" data-hero>
                <span className="h-2 w-2 rounded-full bg-leaf" />
                <span className="section-label">Integrity</span>
              </div>

              <h1 className="mb-6 text-ink text-balance text-4xl md:text-5xl lg:text-6xl" data-hero>
                Integrity from governance to verification.
              </h1>

              <p
                className="text-base md:text-lg text-charcoal/70 leading-relaxed mb-8 max-w-prose"
                data-hero
              >
                We build pilots so communities lead, evidence stays transparent, and verification is
                ready before outcomes are claimed.
              </p>

              <div className="flex flex-wrap gap-4" data-hero>
                <Link href="/pilot-phase" className="btn-primary">
                  See pilot phase
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <Link href="/partners" className="btn-secondary">
                  Partner for verification
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
              <p className="text-xs uppercase tracking-[0.2em] text-leaf/70 mb-3">Integrity first</p>
              <p className="text-2xl md:text-3xl font-display text-white">Designed for verification</p>
            </div>
            <p className="text-sm text-white/70 max-w-md">
              We do not claim outcomes before verification. Pilot reporting is structured to make
              validation straightforward for partners.
            </p>
          </div>
        </div>
      </section>

      {/* Integrity pillars */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">Integrity pillars</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">Designed for transparency and fairness.</h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: Satellite,
                title: 'MRV partnerships',
                description:
                  'We are integrating satellite and field data pipelines with verification partners to ensure traceability.',
              },
              {
                icon: FileCheck,
                title: 'Evidence vaults',
                description:
                  'Every pilot produces a clear trail of documents: consent, baselines, governance, and reporting templates.',
              },
              {
                icon: Users,
                title: 'Community value capture',
                description:
                  'Benefit sharing is designed into the pilot contracts so communities receive more than participation.',
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

      {/* Steps */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">End-to-end flow</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">From governance to verified outcomes.</h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
            {steps.map((step, index) => (
              <StaggerItem key={step.title}>
                <Card variant="default" padding="lg" className="h-full">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 ${index % 2 === 0 ? 'bg-green-tint border-forest/10 text-forest' : 'bg-leaf/12 border-leaf/20 text-forest'}`}>
                      <step.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-forest/70 mb-2">
                        Step {index + 1}
                      </p>
                      <h3 className="text-lg text-forest mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-prose">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Integrity statement */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <QuoteBlock
            quote="We will only report verified outcomes. Until then, we focus on building the governance, data, and transparency systems that make verification possible."
            author="GreenShilling"
            role="Integrity statement"
          />
        </div>
      </section>

      {/* Evidence available */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <Reveal>
                <p className="section-label mb-4">Available now</p>
                <div className="divider-editorial mt-4" />
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mb-6 text-ink">Evidence you can review today.</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-gray-600 leading-relaxed max-w-prose">
                  We are preparing pilot documentation packs that include consent records, baseline
                  methodology notes, and governance agreements. These are available to partners
                  under NDA while pilots are in progress.
                </p>
              </Reveal>
            </div>
            <Card variant="default" padding="lg" className="bg-white" animate>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-leaf/12 border border-leaf/20 text-forest flex items-center justify-center">
                  <Scale className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-forest mb-2">Request an integrity briefing</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We can share our current evidence checklist and verification readiness status.
                  </p>
                  <Link href="/partners" className="btn-primary">
                    Partner briefing
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
