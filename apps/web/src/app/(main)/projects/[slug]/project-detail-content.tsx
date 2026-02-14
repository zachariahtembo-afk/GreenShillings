'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  TreePine,
  Leaf,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../../components/motion';
import { Card } from '../../../../components/ui/card';

interface Community {
  id: string;
  name: string;
  location: string;
  district: string | null;
  region: string | null;
  populationEstimate: number | null;
  engagementModel: string | null;
  consentStatus: string | null;
  consentDate: Date | null;
  primaryContact: string | null;
  contactPhone: string | null;
  notes: string | null;
  projectId: string | null;
  createdAt: Date;
}

interface ProjectData {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  projectType: string;
  status: string;
  standardsAlignment: string[];
  methodology: string | null;
  startDate: Date | null;
  endDate: Date | null;
  targetHectares: number | null;
  targetCO2e: number | null;
  actualCO2e: number | null;
  impactSummary: string | null;
  lessonsLearned: string | null;
  imageUrl: string | null;
  documentUrls: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  communities: Community[];
}

const statusStyles: Record<string, string> = {
  PLANNING: 'text-forest bg-green-tint',
  ACTIVE: 'text-leaf bg-leaf/10',
  MONITORING: 'text-amber-700 bg-amber-50',
  VERIFIED: 'text-emerald-700 bg-emerald-50',
  COMPLETED: 'text-charcoal bg-charcoal/10',
};

function getStatusStyle(status: string) {
  return statusStyles[status] ?? 'text-forest bg-green-tint';
}

export default function ProjectDetailContent({ project }: { project: ProjectData }) {
  const hasMetrics = project.targetHectares || project.targetCO2e || project.actualCO2e;

  return (
    <div className="flex flex-col bg-white text-charcoal">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-8 w-full">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Projects
        </Link>
      </div>

      {/* Hero section */}
      <section className="relative bg-white text-charcoal">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-10 md:py-14 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4" data-hero>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full ${getStatusStyle(project.status)}`}
              >
                <Clock className="h-3 w-3" aria-hidden="true" />
                {project.status}
              </span>
              <span className="text-xs text-charcoal/50">{project.projectType}</span>
            </div>

            <h1
              className="mb-4 text-ink text-balance max-w-2xl text-3xl md:text-4xl lg:text-5xl"
              data-hero
            >
              {project.name}
            </h1>

            <div
              className="flex items-center gap-2 text-sm text-charcoal/60 mb-6"
              data-hero
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {project.location}
            </div>

            <p
              className="text-base md:text-lg text-charcoal/70 leading-relaxed max-w-prose"
              data-hero
            >
              {project.description}
            </p>
          </HeroSequence>
        </div>
      </section>

      {/* Metrics bar */}
      {hasMetrics && (
        <section className="bg-forest text-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-10">
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {project.targetHectares && (
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <TreePine className="h-6 w-6 text-leaf" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-semibold">
                        {project.targetHectares.toLocaleString()}
                      </p>
                      <p className="text-sm text-white/70">Target hectares</p>
                    </div>
                  </div>
                )}

                {project.targetCO2e && (
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Leaf className="h-6 w-6 text-leaf" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-semibold">
                        {project.targetCO2e.toLocaleString()}
                      </p>
                      <p className="text-sm text-white/70">Target tCO2e</p>
                    </div>
                  </div>
                )}

                {project.actualCO2e && (
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-6 w-6 text-leaf" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-semibold">
                        {project.actualCO2e.toLocaleString()}
                      </p>
                      <p className="text-sm text-white/70">Actual tCO2e</p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Standards alignment */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-4">Standards alignment</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.standardsAlignment.map((standard) => (
                <span
                  key={standard}
                  className="text-sm px-3 py-1.5 rounded-full border border-forest/20 text-forest/80 bg-white"
                >
                  {standard}
                </span>
              ))}
            </div>
          </Reveal>
          {project.methodology && (
            <Reveal delay={0.2}>
              <p className="text-sm text-charcoal/70 leading-relaxed max-w-prose">
                <span className="font-semibold text-charcoal">Methodology:</span>{' '}
                {project.methodology}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Impact summary */}
      {project.impactSummary && (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <Reveal>
              <p className="section-label mb-4">Impact summary</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-base md:text-lg text-charcoal/70 leading-relaxed max-w-prose">
                {project.impactSummary}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Engaged communities */}
      {project.communities.length > 0 && (
        <section className="py-14 md:py-20 bg-chalk">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <Reveal>
              <p className="section-label mb-4">Engaged communities</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mb-8 text-ink max-w-2xl">
                Communities partnering on this project
              </h2>
            </Reveal>

            <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
              {project.communities.map((community) => (
                <StaggerItem key={community.id}>
                  <Card variant="outlined" padding="md" className="bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-9 w-9 rounded-lg bg-forest/10 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-forest" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-charcoal">
                          {community.name}
                        </h3>
                        <p className="text-sm text-charcoal/60">
                          {community.location}
                          {community.district && `, ${community.district}`}
                        </p>
                      </div>
                    </div>

                    {community.populationEstimate && (
                      <p className="text-sm text-charcoal/70 mb-2">
                        <span className="font-medium text-charcoal">Est. population:</span>{' '}
                        {community.populationEstimate.toLocaleString()}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {community.engagementModel && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-forest/10 text-forest/80">
                          {community.engagementModel}
                        </span>
                      )}
                      {community.consentStatus && (
                        <span className="text-xs px-2.5 py-1 rounded-full border border-forest/20 text-forest/70">
                          {community.consentStatus}
                        </span>
                      )}
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="mb-6 text-ink max-w-2xl mx-auto">
              Partner with this project
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-charcoal/70 max-w-prose mx-auto mb-8">
              Whether you&apos;re a funder, technical partner, or community organisation,
              there are meaningful ways to contribute to this project&apos;s success.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/partners" className="btn-primary">
                Become a partner
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn-ghost">
                Get in touch
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
