'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertCircle } from 'lucide-react';
import { LogoMark } from '../../../../components/logo';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle magic-link auto-login from ?token= query param
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return;

    setMagicLinkLoading(true);
    setError('');

    signIn('magic-link', { token, redirect: false })
      .then((result) => {
        if (result?.error) {
          setError('Magic link sign-in failed. The link may have expired.');
          setMagicLinkLoading(false);
        } else {
          router.push('/portal');
        }
      })
      .catch(() => {
        setError('An unexpected error occurred. Please try again.');
        setMagicLinkLoading(false);
      });
  }, [searchParams, router]);

  // Handle ?error= from NextAuth (e.g. Google sign-in failures)
  useEffect(() => {
    const authError = searchParams.get('error');
    if (authError) {
      setError('Sign-in failed. Please ensure you are using an authorised account.');
    }
  }, [searchParams]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('portal-credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        router.push('/portal');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/portal' });
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Magic-link auto-login state
  if (magicLinkLoading) {
    return (
      <div className="rounded-xl p-8 md:p-10 bg-white text-charcoal border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
          <p className="text-charcoal/70 font-medium">Signing you in...</p>
        </div>
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 mt-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl p-8 md:p-10 bg-white text-charcoal border border-gray-200 shadow-sm">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 mb-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Email & Password Form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="secondary"
          size="md"
          disabled={loading}
          className="w-full mt-2"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-charcoal/50">or</span>
        </div>
      </div>

      {/* Google Sign-In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-gray-200 text-charcoal font-semibold hover:border-forest/30 hover:shadow-md transition-all duration-200 disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>

      {/* Footer note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-charcoal/60 text-center">
          Partners: use the credentials provided in your invitation email.
          <br />
          Staff: sign in with your <strong>@greenshillings.org</strong> Google account.
        </p>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <div className="bg-gray-50 text-charcoal flex flex-col items-center py-16 md:py-24 px-6 min-h-screen">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <LogoMark className="h-12 w-12" background="none" />
          </Link>
          <h1 className="text-2xl font-bold text-charcoal mb-2">Team Portal</h1>
          <p className="text-charcoal/70">
            Sign in to access the Green Shillings portal
          </p>
        </div>

        {/* Login Card */}
        <Suspense
          fallback={
            <div className="rounded-xl p-8 md:p-10 bg-white text-charcoal border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
                <p className="text-charcoal/70 font-medium">Loading...</p>
              </div>
            </div>
          }
        >
          <LoginContent />
        </Suspense>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-charcoal/70 hover:text-forest transition-colors"
          >
            &larr; Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
}
