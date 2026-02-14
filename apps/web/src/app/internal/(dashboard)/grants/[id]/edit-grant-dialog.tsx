'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Loader2, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { STATUS_LABELS } from '../../_lib/status-config';

interface EditGrantDialogProps {
  proposal: {
    id: string;
    title: string;
    fundingBody: string | null;
    fundingTarget: number | null;
    currency: string;
    deadline: string | null;
    priority: string;
    status: string;
    assignedTo: string | null;
    description: string | null;
    notes: string | null;
  };
}

type FieldErrors = Partial<Record<string, string>>;

const selectClassName =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 focus:outline-none';

function toDateInputValue(val: string | null): string {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export function EditGrantDialog({ proposal }: EditGrantDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState(proposal.title);
  const [fundingBody, setFundingBody] = useState(proposal.fundingBody ?? '');
  const [fundingTarget, setFundingTarget] = useState(
    proposal.fundingTarget != null ? String(proposal.fundingTarget) : '',
  );
  const [currency, setCurrency] = useState(proposal.currency);
  const [deadline, setDeadline] = useState(toDateInputValue(proposal.deadline));
  const [priority, setPriority] = useState(proposal.priority);
  const [status, setStatus] = useState(proposal.status);
  const [assignedTo, setAssignedTo] = useState(proposal.assignedTo ?? '');
  const [description, setDescription] = useState(proposal.description ?? '');
  const [notes, setNotes] = useState(proposal.notes ?? '');

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!title.trim()) next.title = 'Title is required';
    if (fundingTarget && isNaN(Number(fundingTarget)))
      next.fundingTarget = 'Must be a valid number';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function resetForm() {
    setTitle(proposal.title);
    setFundingBody(proposal.fundingBody ?? '');
    setFundingTarget(
      proposal.fundingTarget != null ? String(proposal.fundingTarget) : '',
    );
    setCurrency(proposal.currency);
    setDeadline(toDateInputValue(proposal.deadline));
    setPriority(proposal.priority);
    setStatus(proposal.status);
    setAssignedTo(proposal.assignedTo ?? '');
    setDescription(proposal.description ?? '');
    setNotes(proposal.notes ?? '');
    setErrors({});
    setServerError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch(`/api/internal/grants/${proposal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          fundingBody: fundingBody.trim() || null,
          fundingTarget: fundingTarget ? Number(fundingTarget) : null,
          currency,
          deadline: deadline || null,
          priority,
          status,
          assignedTo: assignedTo.trim() || null,
          description: description.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save changes');
      }

      setSuccess(true);

      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        router.refresh();
      }, 800);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          icon={<Pencil className="h-4 w-4" />}
          iconPosition="left"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Grant Proposal</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="h-10 w-10 text-forest" />
            <p className="text-sm font-medium text-forest">Changes saved successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {serverError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <Input
              label="Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
            />

            <Input
              label="Funding Body"
              name="fundingBody"
              value={fundingBody}
              onChange={(e) => setFundingBody(e.target.value)}
              placeholder="e.g. World Bank, USAID"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Funding Target"
                name="fundingTarget"
                type="number"
                min="0"
                step="any"
                value={fundingTarget}
                onChange={(e) => setFundingTarget(e.target.value)}
                error={errors.fundingTarget}
                placeholder="0"
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={selectClassName}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="TZS">TZS</option>
                  <option value="ZAR">ZAR</option>
                </select>
              </div>
            </div>

            <Input
              label="Deadline"
              name="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={selectClassName}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={selectClassName}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <Input
              label="Assigned To"
              name="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Team member name"
            />

            <Textarea
              label="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              error={errors.description}
              placeholder="Grant proposal description..."
            />

            <Textarea
              label="Internal Notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              error={errors.notes}
              placeholder="Notes visible only to the team..."
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={submitting}
                icon={
                  submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : undefined
                }
                iconPosition="left"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
