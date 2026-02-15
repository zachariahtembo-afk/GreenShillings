'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut, Shield } from 'lucide-react';
import { LogoMark } from '../logo';
import { cn } from '../../lib/utils';
import type { PortalUser } from '../../lib/auth';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface PortalNavProps {
  user: PortalUser;
}

const portalLinks = [
  { href: '/portal', label: 'Overview' },
  { href: '/portal/proposals', label: 'Proposals' },
  { href: '/portal/projects', label: 'Projects' },
  { href: '/portal/verification', label: 'Verification' },
  { href: '/portal/documents', label: 'Documents' },
  { href: '/portal/reports', label: 'Reports' },
] as const;

export function PortalNav({ user }: PortalNavProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: '/portal/login' });
  };

  const isActive = (href: string) => {
    if (href === '/portal') {
      return pathname === '/portal';
    }
    return pathname.startsWith(href);
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="bg-forest sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + PARTNER badge */}
          <div className="flex items-center gap-4">
            <Link href="/mission" className="flex items-center gap-2.5">
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
              PARTNER
            </Badge>
          </div>

          {/* Center: Navigation tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {portalLinks.map((link) => (
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
                  <p className="text-sm font-medium text-white/90">{user.name}</p>
                  <p className="text-xs text-white/50">{user.organization}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-leaf flex items-center justify-center">
                  <span className="text-xs font-bold text-charcoal">{initials}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-charcoal/60 font-normal">{user.organization}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
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
        {portalLinks.map((link) => (
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
