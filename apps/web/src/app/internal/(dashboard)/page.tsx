import Link from 'next/link';
import { ArrowRight, Plus, Clock, FileText } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { auth, sessionToInternalUser } from '../../../lib/auth';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  STATUS_LABELS,
  STATUS_BADGE_VARIANT,
  STATUS_BADGE_CLASS,
  INTERACTION_BADGE_VARIANT,
  formatCurrency,
} from './_lib/status-config';

const PIPELINE_STAGES = [
  { key: 'DRAFT', label: 'Draft', color: 'bg-gray-400' },
  { key: 'IN_REVIEW', label: 'In Review', color: 'bg-amber-500' },
  { key: 'SUBMITTED', label: 'Submitted', color: 'bg-blue-500' },
  { key: 'APPROVED', label: 'Approved', color: 'bg-emerald-500' },
  { key: 'REJECTED', label: 'Rejected', color: 'bg-red-400' },
] as const;

export default async function InternalDashboardPage() {
  const session = await auth();
  const user = sessionToInternalUser(session);
  const firstName = user?.name?.split(' ')[0] || 'there';

  const [
    allProposals,
    recentInteractions,
    orgCount,
    contactCount,
    upcomingDeadlines,
  ] = await Promise.all([
    prisma.proposal.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { project: true },
    }),
    prisma.interaction.findMany({
      orderBy: { date: 'desc' },
      take: 8,
      include: { contact: true, partner: true },
    }),
    prisma.capitalPartner.count({ where: { isActive: true } }),
    prisma.cRMContact.count(),
    prisma.proposal.findMany({
      where: {
        deadline: { gte: new Date() },
        status: { in: ['DRAFT', 'IN_REVIEW', 'SUBMITTED'] },
      },
      orderBy: { deadline: 'asc' },
      take: 5,
    }),
  ]);

  const statusCounts = allProposals.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const activeCount =
    (statusCounts['DRAFT'] || 0) +
    (statusCounts['IN_REVIEW'] || 0) +
    (statusCounts['SUBMITTED'] || 0);

  const recentProposals = allProposals.slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">
            Welcome, {firstName}
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Here&apos;s what&apos;s happening across GreenShillings today.
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

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider">Grants</p>
          <p className="text-2xl font-bold text-charcoal mt-1">{allProposals.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-forest mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider">In Review</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{statusCounts['IN_REVIEW'] || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{statusCounts['APPROVED'] || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider">Organizations</p>
          <p className="text-2xl font-bold text-charcoal mt-1">{orgCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider">Contacts</p>
          <p className="text-2xl font-bold text-charcoal mt-1">{contactCount}</p>
        </div>
      </div>

      {/* Pipeline + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Pipeline Visualization */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider">
              Grant Pipeline
            </h2>
            <Link
              href="/internal/grants"
              className="text-xs font-medium text-forest hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-end gap-3 h-32">
            {PIPELINE_STAGES.map((stage) => {
              const count = statusCounts[stage.key] || 0;
              const maxCount = Math.max(
                ...PIPELINE_STAGES.map((s) => statusCounts[s.key] || 0),
                1,
              );
              const heightPercent = Math.max((count / maxCount) * 100, 8);
              return (
                <Link
                  key={stage.key}
                  href={`/internal/grants?status=${stage.key}`}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <span className="text-sm font-bold text-charcoal">{count}</span>
                  <div
                    className={`w-full rounded-t-md ${stage.color} transition-all group-hover:opacity-80`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-medium text-charcoal/60 text-center leading-tight">
                    {stage.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
            Recent Activity
          </h2>
          {recentInteractions.length === 0 ? (
            <p className="text-sm text-charcoal/50 py-4">No interactions logged yet</p>
          ) : (
            <div className="space-y-3">
              {recentInteractions.slice(0, 6).map((i) => (
                <div key={i.id} className="flex items-start gap-3">
                  <span className="shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-charcoal/60 mt-0.5">
                    {i.type.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{i.subject}</p>
                    <p className="text-xs text-charcoal/50">
                      {i.contact?.name || i.partner?.name || '\u2014'} &middot;{' '}
                      {new Date(i.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge variant={INTERACTION_BADGE_VARIANT[i.type] || 'default'} size="sm">
                    {i.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grants Table + Upcoming Deadlines */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Grants Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider">
              Recent Grants
            </h2>
            <Link
              href="/internal/grants"
              className="text-xs font-medium text-forest hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentProposals.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <FileText className="h-8 w-8 text-charcoal/20 mx-auto mb-2" />
              <p className="text-sm text-charcoal/50">No grants yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                    Grant
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider hidden md:table-cell">
                    Funder
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider hidden sm:table-cell">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProposals.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <Link
                        href={`/internal/grants/${p.id}`}
                        className="text-sm font-medium text-charcoal hover:text-forest transition-colors"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal/60 hidden md:table-cell">
                      {p.fundingBody || '\u2014'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={STATUS_BADGE_VARIANT[p.status] || 'default'}
                        size="sm"
                        className={STATUS_BADGE_CLASS[p.status] || ''}
                      >
                        {STATUS_LABELS[p.status] || p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-sm text-charcoal/70 text-right hidden sm:table-cell">
                      {p.fundingTarget != null
                        ? formatCurrency(p.fundingTarget, p.currency)
                        : '\u2014'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-charcoal/40" />
            <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider">
              Upcoming Deadlines
            </h2>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-charcoal/50 py-4">No upcoming deadlines</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((p) => (
                <Link
                  key={p.id}
                  href={`/internal/grants/${p.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors -mx-1"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-charcoal truncate pr-2">{p.title}</p>
                    <Badge
                      variant={STATUS_BADGE_VARIANT[p.status] || 'default'}
                      size="sm"
                      className={STATUS_BADGE_CLASS[p.status] || ''}
                    >
                      {STATUS_LABELS[p.status] || p.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal/50">
                    {p.deadline
                      ? new Date(p.deadline).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '\u2014'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
