import { prisma } from '../../../../../lib/prisma';
import { auth, sessionToInternalUser } from '../../../../../lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Key, Clock } from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';
import { InvitePartnerDialog } from './invite-dialog';

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'default'> = {
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  INACTIVE: 'default',
};

const roleBadgeVariant: Record<string, 'info' | 'success' | 'default'> = {
  ADMIN: 'info',
  STAFF: 'success',
  PARTNER: 'default',
};

function getAuthMethod(user: { passwordHash: string | null; magicLinkToken: string | null }) {
  if (user.passwordHash) return 'Password';
  if (user.magicLinkToken) return 'Magic Link (pending)';
  return 'Magic Link (used)';
}

export default async function PortalAccessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const internalUser = sessionToInternalUser(session);
  if (!internalUser) redirect('/portal/login');

  const { id } = await params;

  const org = await prisma.partnerOrganization.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          lastLoginAt: true,
          invitedAt: true,
          passwordHash: true,
          magicLinkToken: true,
        },
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!org) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/internal/portal-access"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-charcoal/60 transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Portal Access
      </Link>

      {/* Organization Header */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-charcoal">
                {org.name}
              </h2>
              <Badge variant={statusBadgeVariant[org.status] ?? 'default'} size="sm">
                {org.status}
              </Badge>
            </div>
            <p className="text-charcoal/50 text-sm">
              Created{' '}
              {new Date(org.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <InvitePartnerDialog organizationId={org.id} />
        </div>

        {/* Stats Row */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-chalk">
              <Users className="h-4 w-4 text-charcoal/40 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-0.5">
                  Users
                </p>
                <p className="text-sm font-medium text-charcoal">{org.users.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-chalk">
              <Key className="h-4 w-4 text-charcoal/40 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-0.5">
                  Status
                </p>
                <p className="text-sm font-medium text-charcoal">{org.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-chalk">
              <Clock className="h-4 w-4 text-charcoal/40 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-0.5">
                  Created
                </p>
                <p className="text-sm font-medium text-charcoal">
                  {new Date(org.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
            Members
          </h2>

          {org.users.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="h-10 w-10 text-charcoal/30 mx-auto mb-3" />
              <p className="text-sm text-charcoal/50">
                No users yet. Send an invite to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-sm font-semibold text-charcoal uppercase tracking-wider pb-3">
                      Name
                    </th>
                    <th className="text-left text-sm font-semibold text-charcoal uppercase tracking-wider pb-3">
                      Email
                    </th>
                    <th className="text-left text-sm font-semibold text-charcoal uppercase tracking-wider pb-3">
                      Role
                    </th>
                    <th className="text-left text-sm font-semibold text-charcoal uppercase tracking-wider pb-3">
                      Auth Method
                    </th>
                    <th className="text-left text-sm font-semibold text-charcoal uppercase tracking-wider pb-3">
                      Last Login
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {org.users.map((member) => {
                    const authMethod = getAuthMethod(member);
                    return (
                      <tr key={member.id} className="border-b border-gray-200 last:border-0">
                        <td className="py-4 text-sm font-medium text-charcoal">
                          {member.name}
                        </td>
                        <td className="py-4 text-sm text-charcoal">
                          {member.email}
                        </td>
                        <td className="py-4">
                          <Badge variant={roleBadgeVariant[member.role] ?? 'default'} size="sm">
                            {member.role}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline" size="sm">
                            {authMethod}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-charcoal">
                          {member.lastLoginAt
                            ? new Date(member.lastLoginAt).toLocaleDateString('en-GB', {
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
    </div>
  );
}
