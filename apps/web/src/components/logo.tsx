import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'icon' | 'full';
}

export function Logo({ className = 'h-6 w-6', variant = 'icon' }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <LogoMark className="h-10 w-10" />
        <span className="font-semibold text-xl text-charcoal tracking-tight">
          Green<span className="text-forest">Shillings</span>
        </span>
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle - stability and completeness */}
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />

      {/* Seedling sprout - represents growth, transparency, and new beginnings */}
      <path
        d="M20 34C20 34 17 31 17 26C17 21 20 18 20 18C20 18 23 21 23 26C23 31 20 34 20 34Z"
        fill="currentColor"
        fillOpacity="0.95"
      />

      {/* Left leaf - community empowerment */}
      <path
        d="M20 18C20 18 13.5 16 10 11C6.5 6 8 4 8 4C8 4 13 5.5 16.5 10.5C20 15.5 20 18 20 18Z"
        fill="currentColor"
        fillOpacity="0.75"
      />

      {/* Right leaf - institutional partnership */}
      <path
        d="M20 18C20 18 26.5 16 30 11C33.5 6 32 4 32 4C32 4 27 5.5 23.5 10.5C20 15.5 20 18 20 18Z"
        fill="currentColor"
        fillOpacity="0.75"
      />

      {/* Central stem - connection between community and growth */}
      <line
        x1="20"
        y1="18"
        x2="20"
        y2="34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

interface LogoMarkProps {
  className?: string;
  background?: 'gradient' | 'solid' | 'none';
}

export function LogoMark({ className = 'h-10 w-10', background = 'gradient' }: LogoMarkProps) {
  const bgClasses = {
    gradient: 'bg-gradient-to-br from-forest to-forest-600',
    solid: 'bg-forest',
    none: 'bg-transparent',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl shadow-sm',
        bgClasses[background],
        className,
      )}
    >
      <Logo className={cn('h-3/5 w-3/5', background === 'none' ? 'text-forest' : 'text-white')} />
    </div>
  );
}

// Wordmark for text-only usage
export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-semibold tracking-tight', className)}>
      Green<span className="text-forest">Shillings</span>
    </span>
  );
}
