'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string | ReactNode;
  badge?: string;
  align?: 'left' | 'center';
  size?: 'default' | 'large';
  className?: string;
}

export function SectionHeader({
  title,
  description,
  badge,
  align = 'left',
  size = 'default',
  className,
}: SectionHeaderProps) {
  const alignClasses = align === 'center' ? 'text-center mx-auto' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={cn('mb-10', alignClasses, className)}
    >
      {badge && (
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full bg-leaf-100 px-4 py-1.5 mb-4',
            align === 'center' && 'mx-auto',
          )}
        >
          <div className="h-2 w-2 rounded-full bg-forest" />
          <p className="text-xs font-semibold uppercase tracking-wider text-forest">{badge}</p>
        </div>
      )}
      <h2
        className={cn(
          'font-bold text-charcoal tracking-tight',
          size === 'large'
            ? 'text-3xl md:text-4xl lg:text-5xl'
            : 'text-2xl md:text-3xl lg:text-4xl',
          description ? 'mb-4' : '',
        )}
      >
        {title}
      </h2>
      {description && (
        <div
          className={cn(
            'text-gray-600 leading-relaxed',
            size === 'large'
              ? 'text-lg md:text-xl max-w-prose'
              : 'text-base md:text-lg max-w-prose',
            align === 'center' && 'mx-auto',
          )}
        >
          {typeof description === 'string' ? <p>{description}</p> : description}
        </div>
      )}
    </motion.div>
  );
}
