'use client';

import { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  animate?: boolean;
  delay?: number;
}

const variantClasses = {
  default: 'bg-white border border-forest/8 border-t-[3px] border-t-forest/25 shadow-[0_18px_40px_rgba(10,28,20,0.06)]',
  elevated: 'bg-white border border-forest/8 border-t-[3px] border-t-leaf/40 shadow-[0_24px_50px_rgba(10,28,20,0.12)]',
  outlined: 'bg-transparent border border-forest/15 border-t-[3px] border-t-forest/20',
  filled: 'bg-chalk border-2 border-forest/12',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  animate = false,
  delay = 0,
  className,
  ...props
}: CardProps) {
  const classes = cn(
    'rounded-3xl transition-all duration-300',
    variantClasses[variant],
    paddingClasses[padding],
    hover && 'hover:shadow-elevation-3 hover:-translate-y-1 cursor-pointer',
    className,
  );

  if (animate) {
    return (
      <motion.div
        {...cardMotion}
        transition={{ duration: 0.5, delay }}
        className={classes}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className, as: Tag = 'h3' }: CardTitleProps) {
  return <Tag className={cn('text-xl font-semibold text-charcoal', className)}>{children}</Tag>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn('text-gray-600 leading-relaxed', className)}>{children}</p>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn('mt-6 pt-4 border-t border-forest/10', className)}>{children}</div>;
}

// Card Grid wrapper for consistent layouts
interface CardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  return <div className={cn('grid gap-6', columnClasses[columns], className)}>{children}</div>;
}
