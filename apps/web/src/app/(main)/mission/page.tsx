'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Scale, Users, FileCheck, Shield, Globe2, Handshake } from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { Pillars } from '../../../components/pillars';
import { StatsGrid } from '../../../components/stats-grid';
import { Card, CardGrid } from '../../../components/ui/card';

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
                Building the rails for community-led carbon projects in Tanzania.
              </h1>

              <div className="flex flex-wrap gap-4" data-hero>
                <Link href="/pilot-phase" className="btn-primary">
                  Explore the Pilot Phase
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
            <p className="section-label mb-4">Two pillars</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-10 text-foreground max-w-2xl">
              Advocacy now, pilot phase in progress.
            </h2>
          </Reveal>
          <Pillars
            items={[
              {
                title: 'Advocacy',
                status: 'Active now',
                description:
                  'We run standards literacy, partner mobilization, and policy alignment so Tanzania-led projects can compete on integrity.',
                bullets: [
                  'Standards guidance for communities',
                  'Evidence-led policy engagement',
                  'Partner briefings and transparency tools',
                ],
                href: '/work',
                ctaLabel: 'Advocacy work',
                tone: 'active',
              },
              {
                title: 'Pilot Phase',
                status: 'In progress',
                description:
                  'We are registering pilot projects, onboarding communities, and setting up MRV and payout rails to prove fair value sharing.',
                bullets: [
                  'Project registration + FPIC',
                  'Community governance setup',
                  'MRV partner integrations',
                ],
                href: '/pilot-phase',
                ctaLabel: 'Pilot phase detail',
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
            <p className="section-label mb-4">Why this matters</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-8 text-foreground max-w-2xl">
              Less than 10% of carbon revenue reaches African communities.
            </h2>
          </Reveal>
          <CardGrid columns={2} className="gap-6">
            <Card variant="filled" padding="lg" className="bg-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-tint border border-forest/10 text-primary flex items-center justify-center">
                  <Globe2 className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg text-primary mb-3">Infrastructure Gaps</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Carbon finance is a multi-billion-dollar market, but infrastructure, data
                    integrity, and verification requirements often prevent African projects from
                    attracting capital.
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
                  <h3 className="text-lg text-primary mb-3">Value Capture Mismatch</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Even when capital arrives, communities often receive a smaller share of value.
                    Locally led governance keeps benefit capture closer to the people doing the
                    work.
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
            <p className="section-label mb-4">Locally led</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-foreground max-w-2xl">
              Communities lead the governance, not just participation.
            </h2>
          </Reveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: Users,
                title: 'Local governance first',
                description:
                  'Community governance structures are designed up front, with clear decision rights and oversight.',
              },
              {
                icon: Shield,
                title: 'Benefit sharing built in',
                description:
                  'Pilot design targets meaningful value capture for communities, with transparent reporting on flows.',
              },
              {
                icon: FileCheck,
                title: 'Evidence you can verify',
                description:
                  'We prepare evidence packs and reporting pipelines that are audit-ready and easy to review.',
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
            <p className="section-label mb-4">Pilot phase snapshot</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <h2 className="text-foreground max-w-2xl">
                A credible, investable plan for 2025–2026.
              </h2>
              <Link href="/pilot-phase" className="btn-secondary">
                See pilot phase
              </Link>
            </div>
          </Reveal>

          <StatsGrid
            items={[
              {
                value: '2-4',
                label: 'Pilot Sites Targeted (2025)',
              },
              {
                value: '12-18 Months',
                label: 'From Registration to Payout',
              },
              {
                value: '>50%',
                label: 'Target Community Revenue Share',
              },
            ]}
            columns={3}
          />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/partners" className="btn-primary">
              Partner with us
              <Handshake className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/donate" className="btn-ghost">
              Support the pilots
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
