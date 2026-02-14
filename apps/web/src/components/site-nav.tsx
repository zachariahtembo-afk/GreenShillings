'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Heart } from 'lucide-react';
import { navLinks } from '../lib/nav-links';
import { cn } from '../lib/utils';
import { NucleoIcon } from './nucleo-icon';
import { BrandLogo } from './brand-logo';

export function SiteNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/mission';
    }
    return pathname === href;
  };

  // Filter out donate from main nav links since it will be a CTA button
  const mainNavLinks = navLinks.filter((link) => link.href !== '/donate');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled ? 'bg-white shadow-[0_10px_30px_rgba(10,28,20,0.08)]' : 'bg-white',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
        {/* Logo */}
        <Link href="/" className="group md:justify-self-start">
          <BrandLogo
            className="group-hover:opacity-90 transition-opacity"
            markClassName="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-6 md:justify-self-center">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-[0.95rem] font-semibold pb-2 border-b-2 transition-all duration-300',
                isActive(link.href)
                  ? 'border-forest text-forest'
                  : 'border-transparent text-charcoal/70 hover:text-forest hover:border-forest/40',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 md:justify-self-end">
          <Link href="/portal/login" className="btn-primary text-sm px-4 py-2">
            Partner login
          </Link>
          <Link href="/donate" className="btn-primary text-sm px-4 py-2">
            <Heart className="w-4 h-4" strokeWidth={1} />
            Donate
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center h-10 w-10 -mr-2 text-charcoal/70 hover:text-forest transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" strokeWidth={1} />
          ) : (
            <NucleoIcon name="menu" size={20} className="text-charcoal/70" label="Menu" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-out',
          mobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="border-t border-forest/10 bg-white px-6 py-8 space-y-2">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block py-3 text-lg font-semibold transition-colors duration-300',
                isActive(link.href) ? 'text-forest' : 'text-charcoal/70 hover:text-forest',
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile CTAs */}
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              href="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-base px-6 py-3"
            >
              <Heart className="w-5 h-5" strokeWidth={1} />
              Donate
            </Link>
            <Link
              href="/portal/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-base px-6 py-3"
            >
              Partner login
            </Link>
          </div>

          <div className="pt-6 mt-4 border-t border-forest/10" />
        </nav>
      </div>
    </header>
  );
}
