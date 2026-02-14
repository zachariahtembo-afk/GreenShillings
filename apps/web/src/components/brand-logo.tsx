import Image from 'next/image';
import { cn } from '../lib/utils';

interface BrandLogoProps {
  variant?: 'primary' | 'reverse' | 'mono';
  withWordmark?: boolean;
  className?: string;
  markClassName?: string;
}

const logoSources = {
  primary: '/brand/logo-primary.svg',
  reverse: '/brand/logo-reverse.svg',
  mono: '/brand/logo-mono.svg',
};

export function BrandLogo({
  variant = 'primary',
  withWordmark = false,
  className,
  markClassName,
}: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src={logoSources[variant]}
        alt="GreenShillings wordmark"
        width={160}
        height={40}
        className={cn('h-10 w-auto', markClassName)}
      />
      {withWordmark && (
        <span
          className={cn(
            'font-display text-xl font-semibold tracking-tight',
            variant === 'reverse' ? 'text-white' : 'text-ink',
          )}
        >
          GREEN<span className={variant === 'reverse' ? 'text-leaf' : 'text-forest'}>SHILLINGS</span>
        </span>
      )}
    </div>
  );
}
