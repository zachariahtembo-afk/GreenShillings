'use client';

import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Users,
  Target,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { Card } from '../../../components/ui/card';

const projects = [
  {
    slug: 'salima-agroforestry',
    name: 'Iringa Agroforestry Pilot',
    location: 'Iringa District, Tanzania',
    status: 'Exploring',
    type: 'Agroforestry',
    description:
      'We are exploring an agroforestry pilot in Iringa District that would integrate trees into smallholder farming landscapes. The goal is to demonstrate how community-led agroforestry can build carbon sequestration capacity while improving livelihoods.',
    standards: ['Plan Vivo', 'Gold Standard'],
    aspiration: 'Community-led agroforestry integrated with smallholder farming systems.',
  },
  {
    slug: 'nkhotakota-restoration',
    name: 'Morogoro Forest Restoration',
    location: 'Morogoro District, Tanzania',
    status: 'Exploring',
    type: 'Forest Restoration',
    description:
      'We are investigating a forest restoration opportunity in Morogoro District, working with local communities on indigenous species reforestation and sustainable livelihood development around degraded forest areas.',
    standards: ['Verra VCS'],
    aspiration: 'Community-managed reforestation with indigenous species and livelihood co-benefits.',
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Hero Section */}
      <section className="relative bg-forest text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6" data-hero>
                <span className="h-2 w-2 rounded-full bg-leaf" />
                <span className="section-label-light">Projects</span>
              </div>

              <h1
                className="mb-6 text-white text-balance max-w-2xl text-4xl md:text-5xl lg:text-6xl"
                data-hero
              >
                Building pilots that put communities first.
              </h1>

              <p
                className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-prose"
                data-hero
              >
                We are designing community-led carbon pilots with a nonprofit motive. Our
                approach ensures that if and when projects launch, benefits flow directly to
                the communities where carbon is stored.
              </p>

              <div className="flex flex-wrap gap-4" data-hero>
                <Link href="/partners" className="btn-primary">
                  Partner with us
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Discuss a project
                </Link>
              </div>
            </div>
          </HeroSequence>
        </div>
      </section>

      {/* Principles */}
      <section className="py-10 md:py-14 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                icon: Users,
                title: 'Community ownership',
                desc: 'Every project is designed with and for local communities. They lead, we support.',
              },
              {
                icon: ShieldCheck,
                title: 'Nonprofit motive',
                desc: 'No profit extraction. Revenue stays in the community for development and conservation.',
              },
              {
                icon: Target,
                title: 'Standards aligned',
                desc: 'All projects align with international standards for credibility and market access.',
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-leaf" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-sm text-white/70">{item.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Active Projects */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">Our projects</p>
            <div className="divider-editorial mt-4" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-12 text-ink max-w-2xl">
              Pilot areas we are exploring.
            </h2>
          </Reveal>

          <StaggerContainer className="grid gap-8" staggerDelay={0.15}>
            {projects.map((project) => (
              <StaggerItem key={project.slug}>
                <Card variant="outlined" padding="lg" className="bg-white">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-forest/80 bg-green-tint px-3 py-1 rounded-full">
                          <Clock className="h-3 w-3" />
                          {project.status}
                        </span>
                        <span className="text-xs text-charcoal/50">{project.type}</span>
                      </div>

                      <h3 className="text-xl font-display font-semibold text-charcoal mb-2">
                        {project.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-4">
                        <MapPin className="h-4 w-4" />
                        {project.location}
                      </div>

                      <p className="text-sm text-charcoal/70 leading-relaxed mb-4 max-w-prose">
                        {project.description}
                      </p>

                      <p className="text-sm text-charcoal/60 italic mb-4">
                        {project.aspiration}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full border border-charcoal/15 text-charcoal/60">
                          Standards being evaluated:
                        </span>
                        {project.standards.map((standard) => (
                          <span
                            key={standard}
                            className="text-xs px-2.5 py-1 rounded-full border border-forest/20 text-forest/80"
                          >
                            {standard}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal delay={0.2}>
            <Card variant="outlined" padding="lg" className="bg-green-tint/50 mt-8 border-forest/20">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-forest/10 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5 text-forest" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-forest mb-2">
                    Early stage, by design
                  </h3>
                  <p className="text-sm text-charcoal/70 max-w-prose">
                    These pilots are in early exploration. We are still applying for land access,
                    consulting with communities, and building the governance systems needed before
                    any project launches. We will share updates here as things progress. If you&apos;re
                    interested in partnering,{' '}
                    <Link href="/contact" className="text-forest underline underline-offset-2">
                      get in touch
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="mb-6 text-ink max-w-2xl mx-auto">
              Help us build credible pilots.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-charcoal/70 max-w-prose mx-auto mb-8">
              Whether you&apos;re a funder, MRV provider, community leader, or technical partner,
              there&apos;s a role for you in building Tanzania&apos;s carbon finance infrastructure.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/partners" className="btn-primary">
                Become a partner
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link href="/integrity" className="btn-ghost">
                Our integrity framework
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
