import { redirect } from 'next/navigation';
import {
  FileText,
  ArrowRight,
  CheckCircle,
  Plus,
  ShieldCheck,
  FolderOpen,
  BarChart3,
  Users,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../../../components/ui/badge';
import { prisma } from '../../../lib/prisma';
import {
  auth,
  sessionToPortalUser,
  isStaffSession,
  type SessionWithPortal,
} from '../../../lib/auth';
import type { ProjectStatus } from '@prisma/client';

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: 'warning' | 'success' | 'default' | 'info' }
> = {
  PLANNING: { label: 'Design phase', variant: 'warning' },
  ACTIVE: { label: 'Active', variant: 'success' },
  COMPLETED: { label: 'Completed', variant: 'default' },
  ON_HOLD: { label: 'On hold', variant: 'info' },
};

function formatInteractionType(type: string): string {
  switch (type) {
    case 'MEETING':
      return 'Meeting';
    case 'CALL':
      return 'Call';
    case 'EMAIL':
      return 'Email';
    case 'NOTE':
      return 'Note';
    default:
      return type;
  }
}

export default async function PortalDashboard() {
  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  const user = sessionToPortalUser(session);
  const isStaff = isStaffSession(session);
  const orgId = (session as SessionWithPortal).organizationId;

  const [projectCount, proposalCount, documentCount, recentInteractions] =
    await Promise.all([
      prisma.project.count({
        where: { status: { in: ['PLANNING', 'ACTIVE'] } },
      }),
      prisma.proposal.count(),
      prisma.document.count({
        where: isStaff
          ? {}
          : {
              OR: [
                { visibility: 'PUBLIC' },
                ...(orgId
                  ? [{ access: { some: { organizationId: orgId } } }]
                  : []),
              ],
            },
      }),
      prisma.interaction.findMany({
        orderBy: { date: 'desc' },
        take: 5,
        include: { contact: true, partner: true },
      }),
    ]);

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: { _count: { select: { communities: true } } },
  });

  const portalStats = [
    {
      value: String(projectCount),
      label: 'Active projects',
      icon: <FolderOpen className="h-5 w-5 text-forest" />,
    },
    {
      value: String(proposalCount),
      label: 'Proposals',
      icon: <FileText className="h-5 w-5 text-forest" />,
    },
    {
      value: String(projects.reduce((sum, p) => sum + p._count.communities, 0)),
      label: 'Communities engaged',
      icon: <Users className="h-5 w-5 text-forest" />,
    },
    {
      value: String(documentCount),
      label: 'Documents',
      icon: <BarChart3 className="h-5 w-5 text-forest" />,
    },
  ];

  const now = new Date();
  const lastRefreshed = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const firstName = user?.name.split(' ')[0];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">
              Welcome, {firstName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Last refreshed: {lastRefreshed}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/portal/proposals/new" className="btn-primary group">
              <Plus className="h-4 w-4" />
              New Proposal
            </Link>
            <Link href="/portal/verification" className="btn-secondary group">
              <ShieldCheck className="h-4 w-4" />
              Verification
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 pb-8">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {portalStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-semibold text-charcoal">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 pb-16 space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Projects Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-charcoal">
                  Project portfolio
                </h2>
                <Link
                  href="/portal/projects"
                  className="text-sm font-medium text-forest hover:text-forest-600 flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {projects.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500 text-sm">
                    No projects yet.
                  </div>
                )}
                {projects.map((project) => {
                  const status = statusConfig[project.status];
                  return (
                    <Link
                      key={project.id}
                      href={`/portal/projects/${project.slug}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal truncate group-hover:text-forest transition-colors">
                          {project.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Updated{' '}
                            {project.updatedAt.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-4">
                        <div className="hidden sm:block text-xs text-gray-500">
                          {project._count.communities} communities
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-forest transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-charcoal">
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentInteractions.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500 text-sm">
                    No recent activity.
                  </div>
                )}
                {recentInteractions.map((interaction) => {
                  const typeLabel = formatInteractionType(interaction.type);
                  return (
                    <div key={interaction.id} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            interaction.type === 'MEETING'
                              ? 'bg-green-100'
                              : interaction.type === 'EMAIL'
                                ? 'bg-amber-100'
                                : 'bg-gray-100'
                          }`}
                        >
                          {interaction.type === 'MEETING' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : interaction.type === 'EMAIL' ? (
                            <FileText className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal">
                            {typeLabel}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {interaction.partner?.name ??
                              interaction.contact?.name ??
                              'General'}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {interaction.subject}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {interaction.date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
