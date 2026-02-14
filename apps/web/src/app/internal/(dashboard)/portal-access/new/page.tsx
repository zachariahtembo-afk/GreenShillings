'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';

export default function NewPortalOrganizationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('Organization name is required.');
      setError('Organization name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setNameError(undefined);

    try {
      const res = await fetch('/api/internal/portal-orgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to create organization');
      }

      const newOrg = await res.json();
      setSuccess(true);
      setTimeout(() => {
        router.push(`/internal/portal-access/${newOrg.id}`);
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
          href="/internal/portal-access"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal hover:text-forest transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Portal Access
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">New Organization</h1>
        <p className="text-charcoal/70 mt-1">
          Create a new partner organization for portal access
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              Organization created successfully! Redirecting...
            </div>
          )}

          {error && !success && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <Input
              label="Organization Name *"
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(undefined);
              }}
              required
              placeholder="e.g. Carbon Trust International"
              error={nameError}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              href="/internal/portal-access"
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
              {loading ? 'Creating...' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
