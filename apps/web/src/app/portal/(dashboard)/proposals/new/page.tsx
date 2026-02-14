'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

export default function NewProposalPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fundingBody, setFundingBody] = useState('');
  const [fundingTarget, setFundingTarget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/portal/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          fundingBody,
          fundingTarget: fundingTarget || undefined,
          currency,
          deadline: deadline || undefined,
          priority,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      router.push('/portal/proposals');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
      <Link
        href="/portal/proposals"
        className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Proposals
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal mb-2">New Proposal</h1>
      <p className="text-sm text-charcoal/60 mb-8">
        Create a new funding proposal to track your application.
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-2">
              Proposal Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Iringa Agroforestry - Plan Vivo Application"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-charcoal focus:ring-2 focus:ring-gray-100 focus:border-gray-300 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="fundingBody" className="block text-sm font-medium text-charcoal mb-2">
              Funding Body / Organization
            </label>
            <input
              id="fundingBody"
              type="text"
              value={fundingBody}
              onChange={(e) => setFundingBody(e.target.value)}
              placeholder="e.g., Green Climate Fund, Plan Vivo Foundation"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-charcoal focus:ring-2 focus:ring-gray-100 focus:border-gray-300 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="fundingTarget" className="block text-sm font-medium text-charcoal mb-2">
                Funding Target
              </label>
              <input
                id="fundingTarget"
                type="number"
                value={fundingTarget}
                onChange={(e) => setFundingTarget(e.target.value)}
                placeholder="e.g., 250000"
                min="0"
                step="any"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-charcoal focus:ring-2 focus:ring-gray-100 focus:border-gray-300 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-charcoal mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-charcoal focus:ring-2 focus:ring-gray-100 focus:border-gray-300 outline-none transition-all"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="MWK">MWK</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-charcoal mb-2">
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-charcoal focus:ring-2 focus:ring-gray-100 focus:border-gray-300 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-charcoal mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-charcoal focus:ring-2 focus:ring-gray-100 focus:border-gray-300 outline-none transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the proposal and its objectives..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-charcoal focus:ring-2 focus:ring-gray-100 focus:border-gray-300 outline-none transition-all resize-y"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-charcoal mb-2">
              Internal Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any internal notes, criteria from funder, key contacts..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-charcoal focus:ring-2 focus:ring-gray-100 focus:border-gray-300 outline-none transition-all resize-y"
            />
          </div>

          {/* Document Upload Section */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Documents
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors">
              <Upload className="h-8 w-8 text-charcoal/30 mx-auto mb-3" />
              <p className="text-sm text-charcoal/60">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-charcoal/40 mt-1">
                PDF, DOCX, XLSX up to 25MB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Proposal'}
            </button>
            <Link
              href="/portal/proposals"
              className="px-6 py-3 rounded-xl border border-gray-200 text-charcoal font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
