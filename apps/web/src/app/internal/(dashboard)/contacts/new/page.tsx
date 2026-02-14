'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Input, Textarea } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { Reveal } from '../../../../../components/motion';

interface Partner {
  id: string;
  name: string;
}

export default function NewContactPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    partnerId: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/internal/organizations')
      .then((res) => res.json())
      .then((data) => setPartners(data))
      .catch(() => {
        /* partners dropdown will simply be empty */
      });
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'name' && nameError) {
      setNameError(undefined);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setNameError('Name is required.');
      setError('Name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setNameError(undefined);

    try {
      const res = await fetch('/api/internal/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          title: form.title.trim() || null,
          partnerId: form.partnerId || null,
          notes: form.notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to create contact');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/internal/contacts');
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/internal/contacts"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-forest transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Contacts
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">New Contact</h1>
        <p className="text-charcoal/70 mt-1">Add a new contact to the CRM</p>
      </div>

      {/* Form */}
      <Reveal>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            {success && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                Contact created successfully! Redirecting...
              </div>
            )}

            {error && !success && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Name */}
              <Input
                label="Name *"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Full name"
                error={nameError}
              />

              {/* Email */}
              <Input
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />

              {/* Phone */}
              <Input
                label="Phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />

              {/* Job Title */}
              <Input
                label="Job Title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Programme Director"
              />

              {/* Partner Organization */}
              <div className="space-y-1.5">
                <label htmlFor="partnerId" className="block text-sm font-medium text-charcoal">
                  Organization
                </label>
                <select
                  id="partnerId"
                  name="partnerId"
                  value={form.partnerId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal transition-colors focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none"
                >
                  <option value="">No organization</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <Textarea
                label="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional notes about this contact..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                href="/internal/contacts"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="submit"
                disabled={loading || success}
                icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                iconPosition="left"
              >
                {loading ? 'Creating...' : 'Create Contact'}
              </Button>
            </div>
          </form>
        </div>
      </Reveal>
    </div>
  );
}
