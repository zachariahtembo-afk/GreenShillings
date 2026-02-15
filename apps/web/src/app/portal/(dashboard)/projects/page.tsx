import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Users, Leaf, Target, FolderOpen, MapPin, Calendar } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { prisma } from '../../../../lib/prisma';
import {
  auth,
  type SessionWithPortal,
} from '../../../../lib/auth';
import type { ProjectStatus } from '@prisma/client';

const statusColors: Record<ProjectStatus, string> = {
  PLANNING: 'bg-citrus text-charcoal border-citrus',
  ACTIVE: 'bg-leaf text-charcoal border-leaf',
  COMPLETED: 'bg-gray-100 text-charcoal border-gray-200',
  ON_HOLD: 'bg-gray-100 text-forest border-gray-200',
};

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: 'Design phase',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ON_HOLD: 'On hold',
};

export default async function PortalProjectsPage() {
  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  // Projects are GreenShilling's own pilot projects (shared portfolio items), not
  // per-organization resources. The Project model has no organizationId field, so
  // all authenticated portal users -- staff and partners alike -- see every project.
  // This is intentional: partners need visibility into the full project portfolio.
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      communities: true,
      _count: { select: { documents: true } },
    },
  });

  const activeCount = projects.filter(
    (p) => p.status === 'PLANNING' || p.status === 'ACTIVE'
  ).length;

  const allStandards = [
    ...new Set(projects.flatMap((p) => p.standardsAlignment)),
  ];

  const totalCommunities = projects.reduce(
    (sum, p) => sum + p.communities.length,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-charcoal">Projects</h1>
              <p className="text-gray-500 mt-1">
                Monitor phase progress, standards alignment, and documentation
                readiness for every active partnership.
              </p>
            </div>
            <Link href="/portal/requirements" className="btn-primary group">
              View requirements
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-charcoal">{activeCount}</p>
                <p className="text-xs text-gray-500">Active Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-charcoal">{totalCommunities}</p>
                <p className="text-xs text-gray-500">Total Communities</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Target className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-charcoal">{projects.length}</p>
                <p className="text-xs text-gray-500">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-charcoal">{allStandards.length}</p>
                <p className="text-xs text-gray-500">Standards Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-8 space-y-4">
        {projects.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            No projects found.
          </div>
        )}
        {projects.map((project) => {
          const status = project.status as ProjectStatus;
          return (
            <Link
              key={project.id}
              href={`/portal/projects/${project.slug}`}
              className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-charcoal">
                        {project.name}
                      </h2>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[status]}`}
                      >
                        {statusLabels[status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Last updated{' '}
                        {project.updatedAt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>

                <p className="text-gray-600 mb-4 max-w-prose">
                  {project.description}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-charcoal">
                    Status:
                  </span>
                  <Badge
                    variant={
                      status === 'ACTIVE'
                        ? 'success'
                        : status === 'PLANNING'
                          ? 'warning'
                          : status === 'ON_HOLD'
                            ? 'info'
                            : 'default'
                    }
                  >
                    {statusLabels[status]}
                  </Badge>
                  <div className="flex-1" />
                  <span className="text-sm text-gray-600">
                    {project._count.documents} document
                    {project._count.documents !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Target className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">
                        {project.targetHectares
                          ? `${project.targetHectares.toLocaleString()} ha`
                          : 'TBD'}
                      </p>
                      <p className="text-xs text-gray-500">Hectares</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Users className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">
                        {project.communities.length}
                      </p>
                      <p className="text-xs text-gray-500">Communities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">
                        {project.targetCO2e
                          ? `${project.targetCO2e.toLocaleString()} t`
                          : 'TBD'}
                      </p>
                      <p className="text-xs text-gray-500">Target CO2e</p>
                    </div>
                  </div>
                </div>

                {project.standardsAlignment.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Standards (proposed)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.standardsAlignment.map((standard) => (
                        <span
                          key={standard}
                          className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200"
                        >
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
