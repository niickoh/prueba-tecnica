export type BadgeTone = 'good' | 'warning' | 'serious' | 'critical' | 'neutral' | 'info';

const dotColor: Record<BadgeTone, string> = {
  good: 'bg-status-good',
  warning: 'bg-status-warning',
  serious: 'bg-status-serious',
  critical: 'bg-status-critical',
  neutral: 'bg-status-neutral',
  info: 'bg-accent',
};

interface BadgeProps {
  tone: BadgeTone;
  label: string;
  /** Prefijo accesible, p. ej. "Estado del flujo". */
  srPrefix?: string;
}

/** Base de los badges de estado: el color nunca va solo, siempre con su etiqueta. */
export function Badge({ tone, label, srPrefix }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-sunken px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-ink">
      <span aria-hidden="true" className={`size-2 rounded-full ${dotColor[tone]}`} />
      {srPrefix && <span className="sr-only">{srPrefix}: </span>}
      {label}
    </span>
  );
}
