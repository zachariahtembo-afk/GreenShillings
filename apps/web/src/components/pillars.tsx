import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

export type PillarItem = {
  title: string;
  status: string;
  description: string;
  bullets: string[];
  href?: string;
  ctaLabel?: string;
  tone?: 'active' | 'in-progress';
};

interface PillarsProps {
  items: PillarItem[];
  className?: string;
}

export function Pillars({ items, className }: PillarsProps) {
  return (
    <div className={cn('grid gap-4', className)}>
      {items.map((item) => (
        <Card key={item.title} variant="elevated" padding="lg" className={cn(
          "h-full",
          item.tone === 'active'
            ? 'border-t-[4px] border-t-forest'
            : 'border-t-[4px] border-t-leaf'
        )}>
          <CardHeader className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-forest/70 mb-3">Pillar</p>
              <CardTitle className="text-2xl text-forest">{item.title}</CardTitle>
            </div>
            <span
              className={cn(
                'rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]',
                item.tone === 'active'
                  ? 'border-forest/30 text-forest bg-green-tint'
                  : 'border-leaf/40 text-charcoal bg-leaf/10',
              )}
            >
              {item.status}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed max-w-prose">{item.description}</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-forest" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          {item.href && item.ctaLabel && (
            <CardFooter>
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest"
              >
                {item.ctaLabel}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
