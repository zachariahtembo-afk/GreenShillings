import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, FileText, Clock, CheckCircle2, XCircle, Send, Archive } from 'lucide-react';
import { auth, type SessionWithPortal, isStaffSession } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

const statusConfig = {
  DRAFT: { label: 'Draft', icon: FileText, color: 'text-charcoal/60 bg-charcoal/5' },
  IN_REVIEW: { label: 'In Review', icon: Clock, color: 'text-amber-700 bg-amber-50' },
  SUBMITTED: { label: 'Submitted', icon: Send, color: 'text-blue-700 bg-blue-50' },
  APPROVED: { label: 'Approved', icon: CheckCircle2, color: 'text-green-700 bg-green-50' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'text-red-700 bg-red-50' },
  ARCHIVED: { label: 'Archived', icon: Archive, color: 'text-charcoal/40 bg-charcoal/5' },
} as const;

type ProposalStatusKey = keyof typeof statusConfig;

export default async function ProposalsPage() {
  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  const isStaff = isStaffSession(session);

  // Staff see all, partners see only their own submissions
  const proposals = await prisma.proposal.findMany({
    where: isStaff ? {} : { submittedBy: session.user!.email! },
    orderBy: { updatedAt: 'desc' },
    include: { project: { select: { name: true } } },
  });

  // Compute stats from real data
  const totalCount = proposals.length;
  const inProgressCount = proposals.filter(
    (p) => p.status === 'DRAFT' || p.status === 'IN_REVIEW',
  ).length;
  const submittedCount = proposals.filter((p) => p.status === 'SUBMITTED').length;
  const approvedCount = proposals.filter((p) => p.status === 'APPROVED').length;

  const stats = [
    { label: 'Total', value: String(totalCount), color: 'text-charcoal' },
    { label: 'In Progress', value: String(inProgressCount), color: 'text-amber-700' },
    { label: 'Submitted', value: String(submittedCount), color: 'text-blue-700' },
    { label: 'Approved', value: String(approvedCount), color: 'text-green-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Proposals</h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Manage funding proposals and track applications
          </p>
        </div>
        <Link
          href="/portal/proposals/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Proposal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <FileText className="h-10 w-10 text-charcoal/20 mx-auto mb-3" />
          <p className="text-charcoal/50 mb-4">No proposals yet.</p>
          <Link
            href="/portal/proposals/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create your first proposal
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider px-6 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider px-6 py-3">Funder</th>
                <th className="text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider px-6 py-3">Target</th>
                <th className="text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider px-6 py-3">Deadline</th>
                <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proposals.map((proposal) => {
                const statusKey = proposal.status as ProposalStatusKey;
                const status = statusConfig[statusKey] || statusConfig.DRAFT;
                const StatusIcon = status.icon;

                return (
                  <tr key={proposal.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-charcoal truncate max-w-xs">
                        {proposal.title}
                      </p>
                      <p className="text-xs text-charcoal/50 mt-0.5">
                        {proposal.submittedByName || proposal.submittedBy}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal/60">
                      {proposal.fundingBody || '--'}
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal/60">
                      {proposal.fundingTarget != null
                        ? `${proposal.currency} ${proposal.fundingTarget.toLocaleString()}`
                        : '--'}
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal/60">
                      {proposal.deadline
                        ? new Date(proposal.deadline).toLocaleDateString()
                        : '--'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/portal/proposals/${proposal.id}`}
                        className="text-sm font-semibold text-forest hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
