import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, MessageSquare } from 'lucide-react';
import { prisma } from '../../../../../lib/prisma';
import { Badge } from '../../../../../components/ui/badge';
import {
  STATUS_LABELS,
  STATUS_BADGE_VARIANT,
  STATUS_BADGE_CLASS,
  PRIORITY_BADGE_VARIANT,
  PRIORITY_BADGE_CLASS,
  INTERACTION_BADGE_VARIANT,
  formatCurrency,
  formatDate,
  formatDateTime,
} from '../../_lib/status-config';
import { UploadDocument } from './upload-document';
import { EditGrantDialog } from './edit-grant-dialog';

export default async function GrantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      documents: {
        orderBy: { uploadedAt: 'desc' },
      },
      interactions: {
        orderBy: { date: 'desc' },
        include: {
          contact: true,
          partner: true,
        },
      },
      project: true,
    },
  });

  if (!proposal) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/internal/grants"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-forest transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to grants
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-charcoal">{proposal.title}</h1>
              <Badge
                variant={STATUS_BADGE_VARIANT[proposal.status]}
                className={STATUS_BADGE_CLASS[proposal.status]}
              >
                {STATUS_LABELS[proposal.status]}
              </Badge>
              <Badge
                variant={PRIORITY_BADGE_VARIANT[proposal.priority]}
                className={PRIORITY_BADGE_CLASS[proposal.priority]}
              >
                {proposal.priority}
              </Badge>
            </div>
            {proposal.fundingBody && (
              <p className="text-charcoal/70">{proposal.fundingBody}</p>
            )}
          </div>

          <EditGrantDialog proposal={JSON.parse(JSON.stringify(proposal))} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {proposal.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
                Description
              </h2>
              <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                {proposal.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {proposal.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
                Internal Notes
              </h2>
              <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                {proposal.notes}
              </p>
            </div>
          )}

          {/* Documents & Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-forest" />
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider">
                Documents
              </h2>
              <span className="text-xs text-charcoal/40 ml-auto">
                {proposal.documents.length} file{proposal.documents.length !== 1 ? 's' : ''}
              </span>
            </div>
            <UploadDocument
              proposalId={proposal.id}
              initialDocuments={proposal.documents.map((doc) => ({
                id: doc.id,
                title: doc.title,
                fileName: doc.fileName,
                contentType: doc.contentType,
                sizeBytes: doc.sizeBytes,
                uploadedAt: doc.uploadedAt.toISOString(),
              }))}
              analysisStatus={proposal.analysisStatus ?? null}
              analysisResult={(proposal.analysisResult as Record<string, unknown> | null) ?? null}
            />
          </div>

          {/* Interactions Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-4 w-4 text-forest" />
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider">
                Interactions
              </h2>
              <span className="text-xs text-charcoal/40 ml-auto">
                {proposal.interactions.length} logged
              </span>
            </div>
            {proposal.interactions.length === 0 ? (
              <p className="text-sm text-charcoal/40 py-4">
                No interactions logged yet
              </p>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[17px] top-2 bottom-2 w-px bg-forest/10" />

                <div className="space-y-4">
                  {proposal.interactions.map((interaction) => (
                    <div key={interaction.id} className="flex gap-4 relative">
                      {/* Timeline dot */}
                      <div className="shrink-0 h-[35px] w-[35px] rounded-full bg-chalk border-2 border-forest/20 flex items-center justify-center z-10">
                        <span className="text-[10px] font-bold text-forest">
                          {interaction.type.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <p className="text-sm font-medium text-charcoal">
                            {interaction.subject}
                          </p>
                          <Badge
                            variant={INTERACTION_BADGE_VARIANT[interaction.type] ?? 'default'}
                            size="sm"
                          >
                            {interaction.type}
                          </Badge>
                        </div>
                        {interaction.notes && (
                          <p className="text-sm text-charcoal/60 mb-1 whitespace-pre-wrap">
                            {interaction.notes}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 text-xs text-charcoal/40">
                          <span>{formatDateTime(interaction.date)}</span>
                          {interaction.contact && (
                            <span>with {interaction.contact.name}</span>
                          )}
                          {interaction.partner && (
                            <span>{interaction.partner.name}</span>
                          )}
                          <span>by {interaction.loggedBy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
              Details
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-charcoal/50">Funding Target</dt>
                <dd className="text-lg font-bold text-charcoal mt-0.5">
                  {formatCurrency(proposal.fundingTarget, proposal.currency)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-charcoal/50">Currency</dt>
                <dd className="text-sm text-charcoal mt-0.5">{proposal.currency}</dd>
              </div>

              {proposal.assignedTo && (
                <div>
                  <dt className="text-xs font-medium text-charcoal/50">Assigned To</dt>
                  <dd className="text-sm text-charcoal mt-0.5">{proposal.assignedTo}</dd>
                </div>
              )}

              {proposal.submittedByName && (
                <div>
                  <dt className="text-xs font-medium text-charcoal/50">Created By</dt>
                  <dd className="text-sm text-charcoal mt-0.5">{proposal.submittedByName}</dd>
                </div>
              )}

              <div>
                <dt className="text-xs font-medium text-charcoal/50">Submitted By</dt>
                <dd className="text-sm text-charcoal mt-0.5">{proposal.submittedBy}</dd>
              </div>

              {proposal.project && (
                <div>
                  <dt className="text-xs font-medium text-charcoal/50">Linked Project</dt>
                  <dd className="text-sm text-forest font-medium mt-0.5">
                    {proposal.project.name}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
              Timeline
            </h2>
            <dl className="space-y-4">
              {proposal.deadline && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-charcoal/50">Deadline</dt>
                    <dd className="text-sm font-medium text-charcoal mt-0.5">
                      {formatDate(proposal.deadline)}
                    </dd>
                  </div>
                </div>
              )}

              {proposal.submittedAt && (
                <div>
                  <dt className="text-xs font-medium text-charcoal/50">Submitted to Funder</dt>
                  <dd className="text-sm text-charcoal mt-0.5">
                    {formatDate(proposal.submittedAt)}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-xs font-medium text-charcoal/50">Created</dt>
                <dd className="text-sm text-charcoal mt-0.5">
                  {formatDate(proposal.createdAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-charcoal/50">Last Updated</dt>
                <dd className="text-sm text-charcoal mt-0.5">
                  {formatDate(proposal.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
