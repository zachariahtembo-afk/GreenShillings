import { prisma } from '../../../../lib/prisma';
import { auth, sessionToInternalUser } from '../../../../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Building2 } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'default'> = {
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  INACTIVE: 'default',
};

export default async function PortalAccessPage() {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) redirect('/portal/login');

  const organizations = await prisma.partnerOrganization.findMany({
    orderBy: { name: 'asc' },
    include: {
      users: {
        select: { lastLoginAt: true },
      },
      _count: {
        select: { users: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Portal Access</h1>
        <p className="text-charcoal/70 mt-1">
          Manage partner organizations and portal access
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-charcoal">Organizations</h2>
          <Button
            variant="secondary"
            size="sm"
            href="/internal/portal-access/new"
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
          >
            New Organization
          </Button>
        </div>

        {/* Table Content */}
        {organizations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No partner organizations yet. Create your first organization to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Login
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {organizations.map((org) => {
                  const lastLogin = org.users
                    .map((u) => u.lastLoginAt)
                    .filter(Boolean)
                    .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0];

                  return (
                    <tr
                      key={org.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/internal/portal-access/${org.id}`}
                          className="font-medium text-charcoal hover:text-forest transition-colors"
                        >
                          {org.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusBadgeVariant[org.status] ?? 'default'} size="sm">
                          {org.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {org._count.users}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lastLogin
                          ? new Date(lastLogin).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Never'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
