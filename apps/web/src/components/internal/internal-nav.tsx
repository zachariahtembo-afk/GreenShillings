'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut, Shield } from 'lucide-react';
import { LogoMark } from '../logo';
import { cn } from '../../lib/utils';
import type { InternalUser } from '../../lib/auth';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface InternalNavProps {
  user: InternalUser;
}

const internalLinks = [
  { href: '/internal', label: 'Dashboard' },
  { href: '/internal/grants', label: 'Grants' },
  { href: '/internal/organizations', label: 'Organizations' },
  { href: '/internal/contacts', label: 'Contacts' },
  { href: '/internal/portal-access', label: 'Portal Access' },
] as const;

export function InternalNav({ user }: InternalNavProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const isActive = (href: string) => {
    if (href === '/internal') {
      return pathname === '/internal';
    }
    return pathname.startsWith(href);
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="bg-charcoal sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + INTERNAL badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" background="none" />
              <span className="hidden sm:block text-sm font-semibold text-white/90">
                GREENSHILLING
              </span>
            </Link>
            <Badge
              variant="outline"
              size="sm"
              icon={<Shield className="h-3 w-3" strokeWidth={2} />}
              className="border-white/20 text-white/70 bg-white/5"
            >
              INTERNAL
            </Badge>
          </div>

          {/* Center: Navigation tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors',
                  isActive(link.href)
                    ? 'text-white bg-white/15'
                    : 'text-white/60 hover:text-white hover:bg-white/8',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-white/8 transition-colors">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white/90">{user.email}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-forest flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{initials}</span>
                </div>
                <Badge
                  variant="success"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  ADMIN
                </Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-charcoal/60 font-normal">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/portal" className="cursor-pointer">
                  Partner Portal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  Back to main site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-white/10 px-4 py-1.5 flex gap-1 overflow-x-auto">
        {internalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors',
              isActive(link.href)
                ? 'text-white bg-white/15'
                : 'text-white/60 hover:text-white hover:bg-white/8',
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
