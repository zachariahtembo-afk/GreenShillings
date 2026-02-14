import Link from 'next/link';
import { Plus, ArrowLeft, Search } from 'lucide-react';
import { prisma } from '../../../../lib/prisma';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { formatLabel } from '../_lib/status-config';

const PARTNER_TYPE_BADGE_VARIANT: Record<
  string,
  'default' | 'success' | 'warning' | 'info' | 'outline'
> = {
  impact_investor: 'success',
  foundation: 'info',
  multilateral: 'info',
  corporate: 'warning',
  government: 'outline',
};

const PARTNER_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'impact_investor', label: 'Impact Investor' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'multilateral', label: 'Multilateral' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'government', label: 'Government' },
] as const;

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;

  const partners = await prisma.capitalPartner.findMany({
    where: {
      ...(q && { name: { contains: q, mode: 'insensitive' } }),
      ...(type && type !== 'all' && { partnerType: type }),
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/internal"
              className="text-charcoal/50 hover:text-forest transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold text-charcoal">Organizations</h1>
          </div>
          <p className="text-charcoal/70 mt-1">
            Capital and knowledge partners
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          href="/internal/organizations/new"
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          New Organization
        </Button>
      </div>

      {/* Search */}
      <form className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search by name..."
            className="w-full pl-10 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-charcoal placeholder:text-charcoal/40 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none text-sm"
          />
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          {PARTNER_TYPES.map((partnerType) => {
            const isActive = (type ?? 'all') === partnerType.value;
            const params = new URLSearchParams();
            if (q) params.set('q', q);
            if (partnerType.value !== 'all') params.set('type', partnerType.value);
            const href = params.toString()
              ? `/internal/organizations?${params.toString()}`
              : '/internal/organizations';

            return (
              <Link
                key={partnerType.value}
                href={href}
                className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'border-forest text-forest'
                    : 'border-transparent text-charcoal/60 hover:text-charcoal hover:border-gray-300'
                }`}
              >
                {partnerType.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {partners.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-charcoal/50 text-sm">
            {q || type
              ? 'No organizations found matching your criteria'
              : 'No organizations yet'}
          </p>
          {!q && !type && (
            <Link
              href="/internal/organizations/new"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-forest hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add your first organization
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Geography
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {partners.map((partner) => (
                <tr
                  key={partner.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/internal/organizations/${partner.id}`}
                      className="text-sm font-semibold text-charcoal hover:text-forest transition-colors"
                    >
                      {partner.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        PARTNER_TYPE_BADGE_VARIANT[partner.partnerType] ?? 'default'
                      }
                      size="sm"
                    >
                      {formatLabel(partner.partnerType)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" size="sm">
                      {formatLabel(partner.engagementType)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal/70">
                    {partner.geography || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal/70">
                    {partner.contactEmail ? (
                      <a
                        href={`mailto:${partner.contactEmail}`}
                        className="hover:text-forest transition-colors"
                      >
                        {partner.contactEmail}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={partner.isActive ? 'success' : 'default'}
                      size="sm"
                    >
                      {partner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
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
