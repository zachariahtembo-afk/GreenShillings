import { cn } from '../lib/utils';

interface QuoteBlockProps {
  quote: string;
  author?: string;
  role?: string;
  className?: string;
}

export function QuoteBlock({ quote, author, role, className }: QuoteBlockProps) {
  return (
    <figure
      className={cn(
        'relative rounded-3xl bg-chalk px-10 py-12 md:px-14 md:py-14 border border-forest/8 overflow-hidden',
        className,
      )}
    >
      <div className="absolute left-0 top-8 bottom-8 w-1 rounded-full bg-leaf" />
      <blockquote className="text-xl md:text-2xl font-display font-medium text-charcoal leading-[1.4] tracking-tight">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {(author || role) && (
        <figcaption className="mt-8 flex items-center gap-3">
          <div className="h-px w-8 bg-leaf" />
          <div className="text-sm">
            <span className="font-semibold text-forest">{author}</span>
            {role && <span className="text-charcoal/50 ml-2">{role}</span>}
          </div>
        </figcaption>
      )}
    </figure>
  );
}
