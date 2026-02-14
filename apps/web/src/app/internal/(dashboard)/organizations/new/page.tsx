'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Input, Textarea } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { Reveal } from '../../../../../components/motion';

const PARTNER_TYPES = [
  { value: 'impact_investor', label: 'Impact Investor' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'multilateral', label: 'Multilateral' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'government', label: 'Government' },
];

const ENGAGEMENT_TYPES = [
  { value: 'funder', label: 'Funder' },
  { value: 'technical_partner', label: 'Technical Partner' },
  { value: 'knowledge_partner', label: 'Knowledge Partner' },
  { value: 'advisor', label: 'Advisor' },
];

export default function NewOrganizationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = (form.get('name') as string).trim();

    // Client-side validation
    const errors: Record<string, string> = {};
    if (!name) {
      errors.name = 'Organization name is required';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    const body = {
      name,
      partnerType: form.get('partnerType') as string,
      engagementType: form.get('engagementType') as string,
      geography: (form.get('geography') as string) || null,
      contactName: (form.get('contactName') as string) || null,
      contactEmail: (form.get('contactEmail') as string) || null,
      website: (form.get('website') as string) || null,
      notes: (form.get('notes') as string) || null,
    };

    try {
      const res = await fetch('/api/internal/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create organization');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/internal/organizations');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/internal/organizations"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-forest transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Organizations
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">New Organization</h1>
        <p className="text-charcoal/70 mt-1">
          Add a new capital or knowledge partner
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 mb-6">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Organization created successfully. Redirecting...
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Reveal>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-5">
              {/* Name */}
              <Input
                label="Organization Name *"
                name="name"
                type="text"
                required
                placeholder="e.g. Global Impact Fund"
                error={fieldErrors.name}
              />

              {/* Partner Type */}
              <div className="space-y-1.5">
                <label
                  htmlFor="partnerType"
                  className="block text-sm font-medium text-charcoal"
                >
                  Partner Type *
                </label>
                <select
                  id="partnerType"
                  name="partnerType"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal transition-colors focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none text-sm"
                >
                  <option value="">Select type...</option>
                  {PARTNER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Engagement Type */}
              <div className="space-y-1.5">
                <label
                  htmlFor="engagementType"
                  className="block text-sm font-medium text-charcoal"
                >
                  Engagement Type *
                </label>
                <select
                  id="engagementType"
                  name="engagementType"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal transition-colors focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none text-sm"
                >
                  <option value="">Select engagement...</option>
                  {ENGAGEMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Geography */}
              <Input
                label="Geography"
                name="geography"
                type="text"
                placeholder="e.g. Sub-Saharan Africa"
              />

              {/* Contact Name */}
              <Input
                label="Contact Name"
                name="contactName"
                type="text"
                placeholder="e.g. Jane Doe"
              />

              {/* Contact Email */}
              <Input
                label="Contact Email"
                name="contactEmail"
                type="email"
                placeholder="jane@example.org"
              />

              {/* Website */}
              <Input
                label="Website"
                name="website"
                type="url"
                placeholder="https://example.org"
              />

              {/* Notes */}
              <Textarea
                label="Notes"
                name="notes"
                rows={4}
                placeholder="Relationship context, background, key interests..."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                href="/internal/organizations"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="submit"
                disabled={submitting || success}
                icon={
                  submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : undefined
                }
                iconPosition="left"
              >
                {submitting ? 'Creating...' : 'Create Organization'}
              </Button>
            </div>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
