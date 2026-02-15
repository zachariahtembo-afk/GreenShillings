'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Input, Textarea } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { Reveal } from '../../../../../components/motion';

const currencies = ['USD', 'EUR', 'GBP', 'MWK'] as const;
const priorities = ['low', 'medium', 'high', 'urgent'] as const;

export default function NewGrantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: '',
    fundingBody: '',
    fundingTarget: '',
    currency: 'USD',
    deadline: '',
    priority: 'medium',
    assignedTo: '',
    description: '',
    notes: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) {
      errors.title = 'Title is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        title: form.title,
        fundingBody: form.fundingBody || undefined,
        fundingTarget: form.fundingTarget ? parseFloat(form.fundingTarget) : undefined,
        currency: form.currency,
        priority: form.priority,
        assignedTo: form.assignedTo || undefined,
        description: form.description || undefined,
        notes: form.notes || undefined,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
      };

      const res = await fetch('/api/internal/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to create grant (${res.status})`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/internal/grants');
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/internal/grants"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-forest transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to grants
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">New Grant Application</h1>
        <p className="text-charcoal/70 mt-1">
          Create a new funding proposal to track
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-4">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <p className="text-sm font-medium text-green-700">Grant created. Redirecting...</p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Reveal>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-5">
              {/* Title */}
              <Input
                label="Title *"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., GCF Readiness Programme 2026"
                error={fieldErrors.title}
              />

              {/* Funding Body */}
              <Input
                label="Funding Body"
                name="fundingBody"
                type="text"
                value={form.fundingBody}
                onChange={handleChange}
                placeholder="e.g., Green Climate Fund"
              />

              {/* Funding Target + Currency (inline) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Funding Target"
                  name="fundingTarget"
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.fundingTarget}
                  onChange={handleChange}
                  placeholder="250000"
                />
                <div className="space-y-1.5">
                  <label htmlFor="currency" className="block text-sm font-medium text-charcoal">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal transition-colors focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none"
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deadline + Priority (inline) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                />
                <div className="space-y-1.5">
                  <label htmlFor="priority" className="block text-sm font-medium text-charcoal">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal transition-colors focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assigned To */}
              <Input
                label="Assigned To"
                name="assignedTo"
                type="text"
                value={form.assignedTo}
                onChange={handleChange}
                placeholder="e.g., team-member@greenshilling.org"
              />

              {/* Description */}
              <Textarea
                label="Description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Brief overview of the grant application..."
              />

              {/* Notes */}
              <Textarea
                label="Internal Notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                placeholder="Any internal notes or context..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button variant="outline" size="sm" href="/internal/grants">
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                icon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                iconPosition="left"
              >
                {isSubmitting ? 'Creating...' : 'Create Grant'}
              </Button>
            </div>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
