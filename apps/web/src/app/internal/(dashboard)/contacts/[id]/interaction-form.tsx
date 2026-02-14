'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, ChevronDown } from 'lucide-react';
import { Card } from '../../../../../components/ui/card';
import { Input, Textarea } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { Badge } from '../../../../../components/ui/badge';

const interactionTypes = [
  { value: 'MEETING', label: 'Meeting' },
  { value: 'CALL', label: 'Call' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'NOTE', label: 'Note' },
] as const;

export function InteractionForm({
  contactId,
  partnerId,
}: {
  contactId: string;
  partnerId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [subjectError, setSubjectError] = useState<string | undefined>(undefined);

  const [form, setForm] = useState({
    type: 'NOTE' as string,
    subject: '',
    notes: '',
    date: new Date().toISOString().slice(0, 10),
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'subject' && subjectError) {
      setSubjectError(undefined);
    }
  }

  const collapseAfterSuccess = useCallback(() => {
    setForm({ type: 'NOTE', subject: '', notes: '', date: new Date().toISOString().slice(0, 10) });
    setOpen(false);
    setSuccess(false);
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(collapseAfterSuccess, 1500);
    return () => clearTimeout(timer);
  }, [success, collapseAfterSuccess]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim()) {
      setSubjectError('Subject is required.');
      setError('Subject is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSubjectError(undefined);

    try {
      const res = await fetch('/api/internal/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          subject: form.subject.trim(),
          notes: form.notes.trim() || null,
          date: form.date || undefined,
          contactId,
          partnerId: partnerId || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to log interaction');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        icon={<Plus className="h-4 w-4" />}
        iconPosition="left"
        className="w-full"
      >
        Log Interaction
      </Button>
    );
  }

  return (
    <Card variant="filled" padding="md" animate={false}>
      <form onSubmit={handleSubmit}>
        {success && (
          <div className="mb-4 flex justify-center">
            <Badge variant="success" size="md">
              Interaction logged
            </Badge>
          </div>
        )}

        {error && !success && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* Type */}
          <div className="space-y-1.5">
            <label htmlFor="type" className="block text-sm font-medium text-charcoal">
              Type
            </label>
            <div className="relative">
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal transition-colors focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none pr-8"
              >
                {interactionTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal/40 pointer-events-none" />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label htmlFor="date" className="block text-sm font-medium text-charcoal">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal transition-colors focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <Input
            label="Subject *"
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            placeholder="Brief summary of the interaction"
            error={subjectError}
          />
        </div>

        {/* Notes */}
        <div className="mb-4">
          <Textarea
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Details, outcomes, follow-ups..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
              setSubjectError(undefined);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            type="submit"
            disabled={loading || success}
            icon={loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : undefined}
            iconPosition="left"
          >
            {loading ? 'Saving...' : 'Save Interaction'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
