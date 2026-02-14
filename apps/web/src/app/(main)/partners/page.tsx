'use client';

import Link from 'next/link';
import { ArrowRight, Handshake, Shield, Globe2, Users, LineChart } from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { Card } from '../../../components/ui/card';

export default function PartnersPage() {
  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero */}
      <section className="relative bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6" data-hero>
                <span className="h-2 w-2 rounded-full bg-leaf" />
                <span className="section-label-light">Partners</span>
              </div>

              <h1 className="mb-6 text-white text-balance text-4xl md:text-5xl lg:text-6xl" data-hero>
                Partners who want transparent, locally led pilots.
              </h1>

              <p
                className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-prose"
                data-hero
              >
                We are looking for MRV partners, funders, and implementers who want to build high
                integrity pilot projects in Tanzania with communities leading the governance.
              </p>

              <div className="flex flex-wrap gap-4" data-hero>
                <Link href="/contact" className="btn-primary">
                  Start a partnership
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <Link href="/donate" className="btn-secondary">
                  Support the pilot phase
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
              <p className="text-xs uppercase tracking-[0.2em] text-leaf/70 mb-3">Partner focus</p>
              <p className="text-2xl md:text-3xl font-display text-white">Integrity and accountability</p>
            </div>
            <p className="text-sm text-white/70 max-w-md">
              We prioritize partners who value transparent evidence, fair governance, and community
              value capture.
            </p>
          </div>
        </div>
      </section>

      {/* Why Africa capture is low */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">Why partner now</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-8 text-ink max-w-2xl">
              Global carbon finance is large, but Africa still receives a small share.
            </h2>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card variant="default" padding="lg" className="bg-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-tint border border-forest/10 text-forest flex items-center justify-center">
                  <Globe2 className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-forest mb-3">Infrastructure gap</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Only a small fraction of carbon finance reaches Africa due to limited
                    verification infrastructure, fragmented data systems, and trust deficits.
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
                  <h3 className="text-lg text-forest mb-3">Value capture gap</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Even when flows arrive, communities can receive a smaller share of value.
                    Locally led governance keeps decision-making and benefits closer to the land.
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
            <p className="section-label mb-4">Who we work with</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">
              Collaboration pathways for the pilot phase.
            </h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: Handshake,
                title: 'Funders & donors',
                description:
                  'Support pilot setup and advocacy that builds long-term integrity infrastructure.',
              },
              {
                icon: Shield,
                title: 'MRV & verification',
                description:
                  'Co-design monitoring, reporting, and verification pipelines for Tanzania pilots.',
              },
              {
                icon: Users,
                title: 'Implementing partners',
                description:
                  'Local and regional organizations that can deliver and maintain community programs.',
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
              Schedule a briefing
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/pilot-phase" className="btn-secondary">
              Pilot phase overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
