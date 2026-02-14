import { cn } from '../lib/utils';
import { Card } from './ui/card';

export type StatItem = {
  label: string;
  value: string;
  note?: string;
};

interface StatsGridProps {
  items: StatItem[];
  className?: string;
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function StatsGrid({ items, className, columns = 3 }: StatsGridProps) {
  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {items.map((item) => (
        <Card
          key={item.label}
          variant="outlined"
          padding="lg"
          animate={false}
          className="bg-chalk border-t-[3px] border-t-leaf/50"
        >
          <div className="text-4xl font-display font-semibold text-forest mb-3">{item.value}</div>
          <div className="divider-editorial mb-3" />
          <p className="text-sm text-charcoal/80 font-medium mb-1">{item.label}</p>
          {item.note && <p className="text-xs text-charcoal/50">{item.note}</p>}
        </Card>
      ))}
    </div>
  );
}
