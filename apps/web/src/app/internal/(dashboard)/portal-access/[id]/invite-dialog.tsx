'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InvitePartnerDialogProps {
  organizationId: string;
}

export function InvitePartnerDialog({ organizationId }: InvitePartnerDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authMethod, setAuthMethod] = useState<'magic-link' | 'password'>('magic-link');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function resetForm() {
    setName('');
    setEmail('');
    setAuthMethod('magic-link');
    setPassword('');
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (authMethod === 'password' && !password.trim()) {
      setError('Password is required when using password authentication.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/portal-users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organizationId,
          authMethod,
          password: authMethod === 'password' ? password : undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to invite partner');
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        resetForm();
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          icon={<UserPlus className="h-4 w-4" />}
          iconPosition="left"
        >
          Invite Partner
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Partner User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              Invite sent successfully!
            </div>
          )}

          {error && !success && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jane Phiri"
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            required
          />

          {/* Auth Method Selection */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-charcoal">
              Authentication Method
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('magic-link');
                  setPassword('');
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  authMethod === 'magic-link'
                    ? 'border-forest bg-forest/5 text-forest'
                    : 'border-gray-200 bg-white text-charcoal/70 hover:border-forest/30'
                }`}
              >
                Magic Link
                {authMethod === 'magic-link' && (
                  <Badge variant="success" size="sm" className="ml-2">
                    Selected
                  </Badge>
                )}
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  authMethod === 'password'
                    ? 'border-forest bg-forest/5 text-forest'
                    : 'border-gray-200 bg-white text-charcoal/70 hover:border-forest/30'
                }`}
              >
                Password
                {authMethod === 'password' && (
                  <Badge variant="success" size="sm" className="ml-2">
                    Selected
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Conditional Password Field */}
          {authMethod === 'password' && (
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set initial password"
              required
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              size="sm"
              type="submit"
              disabled={loading || success}
              icon={
                loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : undefined
              }
              iconPosition="left"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
