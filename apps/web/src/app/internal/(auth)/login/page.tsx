'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { AlertCircle, Shield } from 'lucide-react';
import { LogoMark } from '../../../../components/logo';

export default function InternalLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/internal' });
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Dark */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal relative flex-col justify-between p-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <LogoMark className="h-10 w-10" background="none" />
            <span className="text-white/90 font-semibold text-lg">GREENSHILLING</span>
          </Link>
        </div>

        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-leaf" strokeWidth={1.5} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">
              Internal Portal
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Team operations dashboard for GreenShilling.
          </h1>
          <p className="text-white/50 leading-relaxed">
            Manage grants, track relationships, and oversee partner portal access.
            Authentication is restricted to team accounts.
          </p>
        </div>

        <div className="text-xs text-white/30">
          <p>Secured via Google Workspace SSO</p>
          <p className="mt-1">Access restricted to @greenshilling.org accounts</p>
        </div>
      </div>

      {/* Right Panel — Light */}
      <div className="flex-1 flex items-center justify-center p-8 bg-chalk">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <LogoMark className="h-10 w-10" background="none" />
            </Link>
            <h1 className="text-xl font-bold text-charcoal">Internal Portal</h1>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal mb-1">Sign in</h2>
            <p className="text-sm text-charcoal/60 mb-6">
              Use your GreenShilling Google account to continue.
            </p>

            {error && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-5">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg bg-charcoal text-white font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50"
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

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-charcoal/50 text-center">
                Access is restricted to{' '}
                <strong className="text-charcoal/70">@greenshilling.org</strong> team accounts.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <Link
              href="/portal/login"
              className="block text-sm text-forest font-medium hover:underline"
            >
              Partner? Sign in to the partner portal
            </Link>
            <Link
              href="/"
              className="block text-xs text-charcoal/50 hover:text-charcoal/70 transition-colors"
            >
              Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
