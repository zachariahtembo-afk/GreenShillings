import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { footerLinks } from '../lib/nav-links';
import { BrandLogo } from './brand-logo';

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-forest text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="rounded-3xl bg-leaf text-charcoal p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/70 mb-3">
              Partner or support
            </p>
            <h2 className="text-3xl md:text-4xl text-charcoal">
              Build locally led climate finance.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/partners" className="btn-secondary">
              Partner with us
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            <Link href="/donate" className="btn-ghost">
              <Heart className="w-4 h-4" strokeWidth={1} aria-hidden="true" />
              Support our work
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_0.9fr_0.9fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandLogo variant="reverse" markClassName="h-9 w-auto" />
            </Link>
            <p className="mt-4 text-white/70 leading-relaxed">
              Tanzania-led advocacy and pilot phase climate programs. We are building the
              infrastructure for locally led, high-integrity carbon finance.
            </p>
            <div className="mt-6 rounded-2xl border-2 border-white/15 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
                Pilot targets
              </p>
              <p className="text-[11px] text-white/50 mb-4">In progress · 2025–2026</p>
              <div className="grid grid-cols-3 gap-3 text-xs text-white/70">
                <div>
                  <span className="text-leaf font-semibold">Locally led</span>
                  <p className="mt-1">Governance</p>
                </div>
                <div>
                  <span className="text-leaf font-semibold">Transparent</span>
                  <p className="mt-1">Reporting</p>
                </div>
                <div>
                  <span className="text-leaf font-semibold">Community</span>
                  <p className="mt-1">Value share</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {footerLinks.main.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-leaf transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              Access
            </p>
            <nav className="flex flex-col gap-3">
              <Link
                href="/portal/login"
                className="text-white/70 hover:text-leaf transition-colors duration-300"
              >
                Partner login
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/15">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} GREENSHILLING. Registered NGO in Tanzania.
            </p>
            <a
              href="mailto:hello@greenshilling.org"
              className="text-sm text-leaf hover:text-white transition-colors duration-300"
            >
              hello@greenshilling.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
