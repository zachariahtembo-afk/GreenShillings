import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
  external?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-leaf-500 text-charcoal hover:brightness-95 shadow-md',
  secondary: 'bg-forest text-white hover:bg-forest-600 shadow-sm',
  outline: 'border-2 border-forest text-forest hover:bg-chalk hover:border-forest',
  ghost: 'text-charcoal hover:bg-chalk',
  cta: 'bg-forest text-white hover:bg-forest-600 shadow-lg',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      className,
      icon,
      iconPosition = 'right',
      ...props
    },
    ref,
  ) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    const content = (
      <>
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0 transition-transform group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </>
    );

    if ('href' in props && props.href) {
      const { href, external, ...linkProps } = props as ButtonAsLink;

      if (external) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(baseClasses, 'group')}
            {...linkProps}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(baseClasses, 'group')}
          {...linkProps}
        >
          {content}
        </Link>
      );
    }

    const buttonProps = props as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(baseClasses, 'group')}
        {...buttonProps}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
