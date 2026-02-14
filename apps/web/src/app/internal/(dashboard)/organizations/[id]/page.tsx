import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Mail, Globe, MapPin, User } from 'lucide-react';
import { prisma } from '../../../../../lib/prisma';
import { Badge } from '../../../../../components/ui/badge';
import { formatLabel, formatDate, INTERACTION_BADGE_VARIANT } from '../../_lib/status-config';

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

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const partner = await prisma.capitalPartner.findUnique({
    where: { id },
    include: {
      contacts: {
        orderBy: { name: 'asc' },
      },
      interactions: {
        orderBy: { date: 'desc' },
        take: 20,
        include: {
          contact: true,
          proposal: { select: { id: true, title: true } },
        },
      },
    },
  });

  if (!partner) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/internal/organizations"
        className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-forest transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Organizations
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-charcoal">{partner.name}</h1>
              <Badge variant={partner.isActive ? 'success' : 'default'} size="sm">
                {partner.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={PARTNER_TYPE_BADGE_VARIANT[partner.partnerType] ?? 'default'}
                size="sm"
              >
                {formatLabel(partner.partnerType)}
              </Badge>
              <Badge variant="default" size="sm">
                {formatLabel(partner.engagementType)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
          Details
        </h2>
        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {partner.geography && (
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-charcoal/50 mb-1">
                <MapPin className="h-3 w-3" />
                Geography
              </dt>
              <dd className="text-sm text-charcoal">{partner.geography}</dd>
            </div>
          )}
          {partner.contactName && (
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-charcoal/50 mb-1">
                <User className="h-3 w-3" />
                Primary Contact
              </dt>
              <dd className="text-sm text-charcoal">{partner.contactName}</dd>
            </div>
          )}
          {partner.contactEmail && (
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-charcoal/50 mb-1">
                <Mail className="h-3 w-3" />
                Contact Email
              </dt>
              <dd className="text-sm text-charcoal">
                <a
                  href={`mailto:${partner.contactEmail}`}
                  className="text-forest hover:underline"
                >
                  {partner.contactEmail}
                </a>
              </dd>
            </div>
          )}
          {partner.website && (
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-charcoal/50 mb-1">
                <Globe className="h-3 w-3" />
                Website
              </dt>
              <dd className="text-sm text-charcoal">
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest hover:underline"
                >
                  {partner.website.replace(/^https?:\/\//, '')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-charcoal/50 mb-1">
              Created
            </dt>
            <dd className="text-sm text-charcoal">
              {formatDate(partner.createdAt)}
            </dd>
          </div>
        </dl>

        {partner.notes && (
          <div className="mt-5 pt-5 border-t border-forest/10">
            <h3 className="text-xs font-medium text-charcoal/50 mb-2">
              Notes
            </h3>
            <p className="text-sm text-charcoal whitespace-pre-wrap">
              {partner.notes}
            </p>
          </div>
        )}
      </div>

      {/* CRM Contacts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
          Linked Contacts ({partner.contacts.length})
        </h2>
        {partner.contacts.length === 0 ? (
          <p className="text-sm text-charcoal/50 py-2">
            No contacts linked to this organization yet.
          </p>
        ) : (
          <div className="space-y-3">
            {partner.contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/internal/contacts/${contact.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-chalk transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-charcoal group-hover:text-forest transition-colors">
                    {contact.name}
                  </p>
                  <p className="text-xs text-charcoal/50">
                    {[contact.title, contact.email]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <ArrowLeft className="h-3.5 w-3.5 text-charcoal/30 rotate-180" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Interactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
          Recent Interactions ({partner.interactions.length})
        </h2>
        {partner.interactions.length === 0 ? (
          <p className="text-sm text-charcoal/50 py-2">
            No interactions logged for this organization yet.
          </p>
        ) : (
          <div className="space-y-3">
            {partner.interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="p-3 rounded-xl hover:bg-chalk transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={INTERACTION_BADGE_VARIANT[interaction.type] ?? 'default'}
                      size="sm"
                    >
                      {interaction.type}
                    </Badge>
                    <p className="text-sm font-medium text-charcoal">
                      {interaction.subject}
                    </p>
                  </div>
                  <p className="text-xs text-charcoal/50 shrink-0 ml-3">
                    {new Date(interaction.date).toLocaleDateString()}
                  </p>
                </div>
                {interaction.notes && (
                  <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">
                    {interaction.notes}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-charcoal/50">
                  {interaction.contact && (
                    <span>with {interaction.contact.name}</span>
                  )}
                  {interaction.proposal && (
                    <Link
                      href={`/internal/grants/${interaction.proposal.id}`}
                      className="text-forest hover:underline"
                    >
                      Re: {interaction.proposal.title}
                    </Link>
                  )}
                  <span>by {interaction.loggedBy}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
