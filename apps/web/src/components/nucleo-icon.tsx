import { cn } from '../lib/utils';

type NucleoIconName =
  | 'calendar'
  | 'calendar-check'
  | 'calendar-clock'
  | 'chart-bar-axis-x'
  | 'chart-line'
  | 'clock'
  | 'document'
  | 'download'
  | 'external'
  | 'filter'
  | 'home'
  | 'leaf'
  | 'location'
  | 'lock'
  | 'map-pin'
  | 'menu'
  | 'search'
  | 'tree'
  | 'user'
  | 'users'
  | 'shield';

type NucleoIconProps = {
  name: NucleoIconName;
  size?: number;
  className?: string;
  label?: string;
};

export function NucleoIcon({ name, size = 20, className, label }: NucleoIconProps) {
  const iconUrl = `/icons/${name}.svg`;
  const styles: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: 'currentColor',
    WebkitMask: `url(${iconUrl}) no-repeat center / contain`,
    mask: `url(${iconUrl}) no-repeat center / contain`,
  };

  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-block', className)}
      style={styles}
    />
  );
}
