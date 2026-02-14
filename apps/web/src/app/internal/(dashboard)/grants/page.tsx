import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '../../../../lib/prisma';
import type { ProposalStatus } from '@prisma/client';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import {
  STATUS_LABELS,
  STATUS_BADGE_VARIANT,
  STATUS_BADGE_CLASS,
  PRIORITY_BADGE_VARIANT,
  PRIORITY_BADGE_CLASS,
  formatCurrency,
  formatLabel,
} from '../_lib/status-config';

const filterTabs: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'In Review', value: 'IN_REVIEW' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default async function GrantsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || '';

  const where = statusFilter
    ? { status: statusFilter as ProposalStatus }
    : {};

  const proposals = await prisma.proposal.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { project: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Grant Applications</h1>
          <p className="text-charcoal/70 mt-1">
            Track and manage funding proposals
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          href="/internal/grants/new"
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          New Grant
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={
                tab.value
                  ? `/internal/grants?status=${tab.value}`
                  : '/internal/grants'
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Grants Table */}
      {proposals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">
            No grant applications found
            {statusFilter ? ` with status "${STATUS_LABELS[statusFilter]}"` : ''}.
          </p>
          <Link
            href="/internal/grants/new"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-forest hover:underline"
          >
            <Plus className="h-4 w-4" />
            Create your first grant application
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Grant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Funder
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proposals.map((proposal) => (
                <tr
                  key={proposal.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/internal/grants/${proposal.id}`}
                      className="font-semibold text-charcoal hover:text-forest transition-colors"
                    >
                      {proposal.title}
                    </Link>
                    {proposal.project && (
                      <div className="text-xs text-gray-500 mt-1">
                        {proposal.project.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {proposal.fundingBody || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={STATUS_BADGE_VARIANT[proposal.status] || 'default'}
                      size="sm"
                      className={STATUS_BADGE_CLASS[proposal.status] || ''}
                    >
                      {STATUS_LABELS[proposal.status] || proposal.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={PRIORITY_BADGE_VARIANT[proposal.priority] || 'default'}
                      size="sm"
                      className={PRIORITY_BADGE_CLASS[proposal.priority] || ''}
                    >
                      {formatLabel(proposal.priority)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {proposal.fundingTarget != null
                      ? formatCurrency(proposal.fundingTarget, proposal.currency)
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {proposal.deadline
                      ? new Date(proposal.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
