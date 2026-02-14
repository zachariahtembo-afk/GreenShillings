import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Clock,
  Users,
  CheckCircle,
  Eye,
  Shield,
  Leaf,
  MapPin,
  Calendar,
  Download,
} from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';
import { prisma } from '../../../../../lib/prisma';
import {
  auth,
  isStaffSession,
  type SessionWithPortal,
} from '../../../../../lib/auth';
import type { ProjectStatus, MilestoneType } from '@prisma/client';

const statusColors: Record<ProjectStatus, string> = {
  PLANNING: 'bg-citrus text-charcoal',
  ACTIVE: 'bg-leaf text-charcoal',
  COMPLETED: 'bg-gray-100 text-charcoal',
  ON_HOLD: 'bg-gray-100 text-forest',
};

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: 'Design phase',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ON_HOLD: 'On hold',
};

const categoryColors: Record<string, string> = {
  Engagement: 'bg-forest text-white',
  Technical: 'bg-leaf text-charcoal',
  Methodology: 'bg-citrus text-charcoal',
  MRV: 'bg-forest text-white',
  Legal: 'bg-gray-100 text-charcoal border border-gray-200',
};

const docStatusBadgeColors: Record<string, string> = {
  FINAL: 'bg-leaf text-charcoal',
  DRAFT: 'bg-citrus text-charcoal',
  REVIEW: 'bg-gray-100 text-forest border border-gray-200',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

function formatMilestoneType(type: MilestoneType): string {
  switch (type) {
    case 'TREES_PLANTED':
      return 'Trees Planted';
    case 'HECTARES_RESTORED':
      return 'Hectares Restored';
    case 'COMMUNITY_TRAINED':
      return 'Community Trained';
    case 'CARBON_VERIFIED':
      return 'Carbon Verified';
    case 'HARVEST_COMPLETED':
      return 'Harvest Completed';
    case 'PAYMENT_DISTRIBUTED':
      return 'Payment Distributed';
    case 'MONITORING_COMPLETE':
      return 'Monitoring Complete';
    case 'CUSTOM':
      return 'Milestone';
    default:
      return type;
  }
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function PortalProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  const isStaff = isStaffSession(session);
  const orgId = (session as SessionWithPortal).organizationId;

  const project = await prisma.project.findUnique({
    where: { slug: projectId },
    include: {
      communities: true,
      documents: {
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
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!project) notFound();

  const milestones = await prisma.projectMilestone.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: 'desc' },
  });

  const status = project.status as ProjectStatus;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <Link
            href="/portal/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-charcoal">
                  {project.name}
                </h1>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[status]}`}
                >
                  {statusLabels[status]}
                </span>
              </div>
              <p className="text-gray-500 max-w-prose mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {project.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Last updated{' '}
                  {project.updatedAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {project.methodology && (
                  <span className="text-gray-500">
                    Methodology: {project.methodology}
                  </span>
                )}
              </div>
            </div>
            <Link href="/portal/documents" className="btn-primary group flex-shrink-0">
              View documents
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200">
            <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-forest" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">
                {project.targetHectares
                  ? `${project.targetHectares.toLocaleString()} ha`
                  : 'TBD'}
              </p>
              <p className="text-xs text-gray-500">Target Area</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200">
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
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200">
            <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-forest" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">
                {project.documents.length}
              </p>
              <p className="text-xs text-gray-500">Documents</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200">
            <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <Eye className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">
                {project.targetCO2e
                  ? `${project.targetCO2e.toLocaleString()} t`
                  : 'TBD'}
              </p>
              <p className="text-xs text-gray-500">Target CO2e (t)</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Communities */}
            {project.communities.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-6">
                  Communities
                </h2>
                <div className="space-y-4">
                  {project.communities.map((community) => (
                    <div
                      key={community.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="h-10 w-10 rounded-full bg-leaf flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-charcoal" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-charcoal">
                          {community.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {community.location}
                          {community.district
                            ? `, ${community.district}`
                            : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          {community.populationEstimate && (
                            <span className="text-xs text-gray-500">
                              ~{community.populationEstimate.toLocaleString()}{' '}
                              people
                            </span>
                          )}
                          {community.consentStatus && (
                            <Badge
                              variant={
                                community.consentStatus === 'obtained'
                                  ? 'success'
                                  : community.consentStatus === 'documented'
                                    ? 'info'
                                    : 'warning'
                              }
                              size="sm"
                            >
                              FPIC: {community.consentStatus}
                            </Badge>
                          )}
                          {community.engagementModel && (
                            <span className="text-xs text-gray-500">
                              {community.engagementModel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-charcoal mb-6">
                Milestones
              </h2>
              {milestones.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No milestones recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone, index) => {
                    const isAchieved = !!milestone.achievedAt;
                    return (
                      <div key={milestone.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              isAchieved ? 'bg-leaf' : 'bg-gray-100'
                            }`}
                          >
                            {isAchieved ? (
                              <CheckCircle className="h-4 w-4 text-charcoal" />
                            ) : (
                              <Clock className="h-4 w-4 text-charcoal" />
                            )}
                          </div>
                          {index < milestones.length - 1 && (
                            <div
                              className={`w-0.5 flex-1 mt-2 ${
                                isAchieved ? 'bg-leaf' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-medium text-gray-500">
                              {formatMilestoneType(milestone.milestoneType)}
                            </span>
                            {isAchieved && (
                              <Badge variant="success" size="sm">
                                Achieved
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium text-charcoal">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {milestone.description}
                          </p>
                          {milestone.achievedAt && (
                            <p className="text-xs text-gray-400 mt-2">
                              Achieved{' '}
                              {milestone.achievedAt.toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                          )}
                          {milestone.achievedValue != null &&
                            milestone.targetValue != null && (
                              <p className="text-xs text-gray-500 mt-1">
                                {milestone.achievedValue.toLocaleString()} /{' '}
                                {milestone.targetValue.toLocaleString()}{' '}
                                achieved
                              </p>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Impact & Lessons */}
            {(project.impactSummary || project.lessonsLearned) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-6">
                  Impact & Lessons
                </h2>
                {project.impactSummary && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-charcoal mb-2">
                      Impact Summary
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {project.impactSummary}
                    </p>
                  </div>
                )}
                {project.lessonsLearned && (
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal mb-2">
                      Lessons Learned
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {project.lessonsLearned}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Evidence Vault */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Evidence Vault
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Evidence and verification materials
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {project.documents.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500 text-sm">
                    No documents available.
                  </div>
                )}
                {project.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {doc.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {doc.category && (
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                categoryColors[doc.category] ??
                                'bg-gray-100 text-charcoal'
                              }`}
                            >
                              {doc.category}
                            </span>
                          )}
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              docStatusBadgeColors[doc.status] ??
                              'bg-gray-100 text-charcoal'
                            }`}
                          >
                            {doc.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {doc.createdAt.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          {doc.sizeBytes && (
                            <span className="text-xs text-gray-400">
                              {formatFileSize(doc.sizeBytes)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Download className="h-4 w-4 text-forest" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <Link
                  href="/portal/documents"
                  className="text-sm font-medium text-leaf-600 hover:text-leaf-700 flex items-center gap-1"
                >
                  View all documents
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
