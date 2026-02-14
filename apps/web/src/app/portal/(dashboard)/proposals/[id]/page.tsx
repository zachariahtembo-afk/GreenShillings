import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Archive,
  Upload,
  Calendar,
  DollarSign,
  Building2,
  User,
  MessageSquare,
  Phone,
  Mail,
  StickyNote,
} from 'lucide-react';
import { auth, type SessionWithPortal, isStaffSession } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

const statusConfig = {
  DRAFT: { label: 'Draft', icon: FileText, color: 'text-charcoal/60 bg-charcoal/5' },
  IN_REVIEW: { label: 'In Review', icon: Clock, color: 'text-amber-700 bg-amber-50' },
  SUBMITTED: { label: 'Submitted', icon: Send, color: 'text-blue-700 bg-blue-50' },
  APPROVED: { label: 'Approved', icon: CheckCircle2, color: 'text-green-700 bg-green-50' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'text-red-700 bg-red-50' },
  ARCHIVED: { label: 'Archived', icon: Archive, color: 'text-charcoal/40 bg-charcoal/5' },
} as const;

type ProposalStatusKey = keyof typeof statusConfig;

const interactionIcons = {
  MEETING: MessageSquare,
  CALL: Phone,
  EMAIL: Mail,
  NOTE: StickyNote,
} as const;

type InteractionTypeKey = keyof typeof interactionIcons;

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  const isStaff = isStaffSession(session);

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      project: { select: { name: true, slug: true } },
      documents: true,
      interactions: {
        orderBy: { date: 'desc' },
        include: { contact: true },
      },
    },
  });

  if (!proposal) notFound();

  // If partner user, verify they submitted it
  if (!isStaff && proposal.submittedBy !== session.user!.email) {
    notFound();
  }

  const statusKey = proposal.status as ProposalStatusKey;
  const status = statusConfig[statusKey] || statusConfig.DRAFT;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
      <Link
        href="/portal/proposals"
        className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Proposals
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal mb-2">
            {proposal.title}
          </h1>
          <p className="text-sm text-charcoal/60">
            Created {new Date(proposal.createdAt).toLocaleDateString()} by{' '}
            {proposal.submittedByName || proposal.submittedBy}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Overview</h2>
            {proposal.description ? (
              <p className="text-sm text-charcoal/70 whitespace-pre-wrap leading-relaxed">
                {proposal.description}
              </p>
            ) : (
              <p className="text-sm text-charcoal/40 italic">No description provided.</p>
            )}

            {proposal.notes && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-charcoal mb-2">Internal Notes</h3>
                <p className="text-sm text-charcoal/70 whitespace-pre-wrap leading-relaxed">
                  {proposal.notes}
                </p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">Documents</h2>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline">
                <Upload className="h-4 w-4" />
                Upload
              </button>
            </div>

            {proposal.documents.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <FileText className="h-8 w-8 text-charcoal/20 mx-auto mb-2" />
                <p className="text-sm text-charcoal/50">No documents attached yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {proposal.documents.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 text-forest/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">{doc.title}</p>
                        <p className="text-xs text-charcoal/50">
                          {doc.fileName} &bull; {formatFileSize(doc.sizeBytes)} &bull;{' '}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interaction History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Activity & Interactions</h2>

            {proposal.interactions.length === 0 ? (
              <div className="flex items-start gap-3 text-sm">
                <Clock className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                <p className="text-charcoal/60">
                  Proposal created on {new Date(proposal.createdAt).toLocaleDateString()}. No
                  interactions logged yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposal.interactions.map((interaction) => {
                  const typeKey = interaction.type as InteractionTypeKey;
                  const Icon = interactionIcons[typeKey] || MessageSquare;

                  return (
                    <div key={interaction.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-forest" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-charcoal">{interaction.subject}</p>
                          <span className="text-xs text-charcoal/40">
                            {interaction.type.toLowerCase()}
                          </span>
                        </div>
                        {interaction.notes && (
                          <p className="text-sm text-charcoal/60 line-clamp-2">
                            {interaction.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-charcoal/40">
                          <span>{new Date(interaction.date).toLocaleDateString()}</span>
                          {interaction.contact && (
                            <span>with {interaction.contact.name}</span>
                          )}
                          <span>by {interaction.loggedBy}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <StatusIcon className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-charcoal/50">Status</dt>
                  <dd className="font-medium text-charcoal">{status.label}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-charcoal/50">Funding Body</dt>
                  <dd className="font-medium text-charcoal">
                    {proposal.fundingBody || 'Not set'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-charcoal/50">Target</dt>
                  <dd className="font-medium text-charcoal">
                    {proposal.fundingTarget
                      ? formatCurrency(proposal.fundingTarget, proposal.currency)
                      : '--'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-charcoal/50">Deadline</dt>
                  <dd className="font-medium text-charcoal">
                    {proposal.deadline
                      ? new Date(proposal.deadline).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '--'}
                  </dd>
                </div>
              </div>
              {proposal.project && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-charcoal/50">Project</dt>
                    <dd className="font-medium text-charcoal">{proposal.project.name}</dd>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-charcoal/50">Submitted By</dt>
                  <dd className="font-medium text-charcoal">
                    {proposal.submittedByName || proposal.submittedBy}
                  </dd>
                </div>
              </div>
              {proposal.assignedTo && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-charcoal/50">Assigned To</dt>
                    <dd className="font-medium text-charcoal">{proposal.assignedTo}</dd>
                  </div>
                </div>
              )}
              {proposal.submittedAt && (
                <div className="flex items-start gap-2">
                  <Send className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-charcoal/50">Submitted to Funder</dt>
                    <dd className="font-medium text-charcoal">
                      {new Date(proposal.submittedAt).toLocaleDateString()}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-2">Priority</h2>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                proposal.priority === 'urgent'
                  ? 'text-red-700 bg-red-50'
                  : proposal.priority === 'high'
                    ? 'text-amber-700 bg-amber-50'
                    : proposal.priority === 'medium'
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-charcoal/60 bg-charcoal/5'
              }`}
            >
              {proposal.priority.charAt(0).toUpperCase() + proposal.priority.slice(1)}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-2">Timeline</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-charcoal/50">Created</dt>
                <dd className="font-medium text-charcoal">
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-charcoal/50">Last Updated</dt>
                <dd className="font-medium text-charcoal">
                  {new Date(proposal.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
