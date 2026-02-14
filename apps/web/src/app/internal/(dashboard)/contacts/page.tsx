import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { prisma } from '../../../../lib/prisma';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';

export default async function ContactsListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const contacts = await prisma.cRMContact.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      partner: { select: { id: true, name: true } },
      _count: { select: { interactions: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          href="/internal/contacts/new"
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          New Contact
        </Button>
      </div>

      {/* Search and Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <form>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={q ?? ''}
                placeholder="Search contacts by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-300 focus:ring-2 focus:ring-gray-100 focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Table */}
        {contacts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500">
              {q ? `No contacts matching "${q}"` : 'No contacts yet. Add your first contact to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interactions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/internal/contacts/${contact.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                      >
                        {contact.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {contact.title || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {contact.email}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.partner ? (
                        <Badge variant="info" size="sm">
                          {contact.partner.name}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {contact._count.interactions}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
