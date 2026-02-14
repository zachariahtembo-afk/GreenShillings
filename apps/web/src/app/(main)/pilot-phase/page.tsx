'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardList, Users, Database, Wallet, Shield } from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { StatsGrid } from '../../../components/stats-grid';
import { Card } from '../../../components/ui/card';

export default function PilotPhasePage() {
  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero */}
      <section className="relative bg-chalk text-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-18 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6 text-forest/70" data-hero>
                <span className="h-2 w-2 rounded-full bg-citrus" />
                <span className="section-label">Pilot phase · In progress</span>
              </div>

              <h1 className="mb-6 text-ink text-balance text-4xl md:text-5xl lg:text-6xl" data-hero>
                Building the pilots that prove fair value sharing.
              </h1>

              <p
                className="text-base md:text-lg text-charcoal/70 leading-relaxed mb-8 max-w-prose"
                data-hero
              >
                We are registering pilot projects, preparing community governance, and aligning MRV
                partnerships so the first pilots can launch with full transparency.
              </p>

              <div className="flex flex-wrap gap-4" data-hero>
                <Link href="/partners" className="btn-primary">
                  Partner with the pilots
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <Link href="/donate" className="btn-secondary">
                  Support pilot setup
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
              <p className="text-xs uppercase tracking-[0.2em] text-leaf/70 mb-3">Status</p>
              <p className="text-2xl md:text-3xl font-display text-white mb-2">Registration underway</p>
              <p className="text-sm text-white/70 max-w-prose">
                We are compiling FPIC documentation, baseline data, and implementation plans for first
                pilots.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                Built for integrity
              </p>
              <p className="text-lg font-semibold text-white mb-2">Evidence-first implementation</p>
              <p className="text-sm text-white/70 max-w-prose">
                Every pilot is structured for transparent data capture and shared governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we're building */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">What we are building</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">Pilot infrastructure in progress.</h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
            {[
              {
                icon: ClipboardList,
                title: 'Project registration',
                description:
                  'Registering pilot projects with documentation, baseline data, and clear benefit-sharing terms.',
              },
              {
                icon: Users,
                title: 'Community onboarding',
                description:
                  'Building governance councils, consent records, and feedback loops before implementation starts.',
              },
              {
                icon: Database,
                title: 'MRV integrations',
                description:
                  'Preparing partnerships with MRV providers and satellite data teams for transparent reporting.',
              },
              {
                icon: Wallet,
                title: 'Payout rails',
                description:
                  'Designing clear distribution rules and payment pathways that keep value close to communities.',
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
            <p className="section-label mb-4">Pilot targets</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-10 text-ink max-w-2xl">
              Targets for the pilot phase (not yet delivered).
            </h2>
          </Reveal>

          <StatsGrid
            items={[
              {
                value: '2 pilot sites',
                label: 'Registration targets',
                note: 'In progress — site selection underway.',
              },
              {
                value: 'Community councils',
                label: 'Local governance structures',
                note: 'Being assembled with FPIC processes.',
              },
              {
                value: 'MRV-ready',
                label: 'Verification partnerships',
                note: 'Integrations preparing for launch.',
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
                <p className="section-label mb-4">Locally led governance</p>
                <div className="divider-editorial mt-4" />
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mb-6 text-ink">
                  Communities capture value, not just participation.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-gray-600 leading-relaxed max-w-prose">
                  The pilot phase prioritizes community decision rights, transparent budget
                  disclosures, and shared oversight. Each pilot is designed with communities as
                  co-owners of the work and the benefits it generates.
                </p>
              </Reveal>
            </div>
            <Card variant="default" padding="lg" className="bg-white" animate>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-leaf/12 border border-leaf/20 text-forest flex items-center justify-center">
                  <Shield className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-forest mb-2">Integrity checkpoints</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li>Documented consent and governance agreements.</li>
                    <li>Transparent budget and benefit-sharing terms.</li>
                    <li>Audit-ready data capture for verification partners.</li>
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
