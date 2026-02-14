import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building2, Mail, Phone, Briefcase, MessageSquare } from 'lucide-react';
import { prisma } from '../../../../../lib/prisma';
import { InteractionForm } from './interaction-form';
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '../../../../../components/ui/button';
import { INTERACTION_BADGE_VARIANT } from '../../_lib/status-config';

const typeLabels: Record<string, string> = {
  MEETING: 'Meeting',
  CALL: 'Call',
  EMAIL: 'Email',
  NOTE: 'Note',
};

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contact = await prisma.cRMContact.findUnique({
    where: { id },
    include: {
      partner: { select: { id: true, name: true } },
      interactions: {
        orderBy: { date: 'desc' },
        include: { proposal: { select: { id: true, title: true } } },
      },
    },
  });

  if (!contact) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/internal/contacts"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-forest transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Contacts
      </Link>

      {/* Contact Header */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-charcoal">
                {contact.name}
              </h2>
              {contact.title && (
                <p className="text-charcoal/70 mt-1">{contact.title}</p>
              )}
            </div>
            {contact.partner && (
              <Button
                variant="ghost"
                size="sm"
                href={`/internal/organizations/${contact.partner.id}`}
                icon={<Building2 className="h-3.5 w-3.5" />}
                iconPosition="left"
              >
                {contact.partner.name}
              </Button>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contact.email && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-chalk">
                <Mail className="h-4 w-4 text-charcoal/40 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-0.5">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-sm text-forest hover:underline">
                    {contact.email}
                  </a>
                </div>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-chalk">
                <Phone className="h-4 w-4 text-charcoal/40 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-0.5">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-sm text-charcoal hover:underline">
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}
            {contact.title && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-chalk">
                <Briefcase className="h-4 w-4 text-charcoal/40 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-0.5">Job Title</p>
                  <p className="text-sm text-charcoal">{contact.title}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-chalk">
              <MessageSquare className="h-4 w-4 text-charcoal/40 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-0.5">Interactions</p>
                <p className="text-sm text-charcoal">{contact.interactions.length} logged</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {contact.notes && (
          <div className="border-t border-gray-200 p-6">
            <p className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm text-charcoal/80 whitespace-pre-wrap">{contact.notes}</p>
          </div>
        )}
      </div>

      {/* Interactions Section */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-5">Interactions</h2>

          {/* Log Interaction Form */}
          <InteractionForm
            contactId={contact.id}
            partnerId={contact.partnerId ?? undefined}
          />

          {/* Timeline */}
          {contact.interactions.length === 0 ? (
            <p className="text-sm text-charcoal/50 py-6 text-center">
              No interactions logged yet. Use the form above to log the first one.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {contact.interactions.map((interaction) => {
                const label = typeLabels[interaction.type] || typeLabels.NOTE;
                const badgeVariant = INTERACTION_BADGE_VARIANT[interaction.type] || 'default';
                return (
                  <div
                    key={interaction.id}
                    className="relative pl-6 pb-4 border-l-2 border-forest/10 last:border-transparent last:pb-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-forest/40" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={badgeVariant} size="sm">
                            {label}
                          </Badge>
                          <span className="text-xs text-charcoal/50">
                            {new Date(interaction.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-charcoal">{interaction.subject}</p>
                        {interaction.notes && (
                          <p className="text-sm text-charcoal/70 mt-1 whitespace-pre-wrap">
                            {interaction.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-charcoal/50">
                          <span>Logged by {interaction.loggedBy}</span>
                          {interaction.proposal && (
                            <Link
                              href={`/internal/grants/${interaction.proposal.id}`}
                              className="text-forest hover:underline"
                            >
                              Re: {interaction.proposal.title}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
