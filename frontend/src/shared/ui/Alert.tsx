import type { ReactNode } from 'react';

type AlertTone = 'warning' | 'info' | 'critical';

const toneStyles: Record<AlertTone, string> = {
  warning: 'border-status-warning',
  info: 'border-accent',
  critical: 'border-status-critical',
};

const toneIcon: Record<AlertTone, string> = {
  warning: '⚠',
  info: 'ℹ',
  critical: '⛔',
};

const toneLabel: Record<AlertTone, string> = {
  warning: 'Aviso',
  info: 'Información',
  critical: 'Error',
};

export function Alert({ tone, children }: { tone: AlertTone; children: ReactNode }) {
  return (
    <div
      role={tone === 'critical' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-lg border-l-4 bg-surface px-4 py-3 text-sm text-ink ${toneStyles[tone]}`}
    >
      <span aria-hidden="true">{toneIcon[tone]}</span>
      <p>
        <span className="sr-only">{toneLabel[tone]}: </span>
        {children}
      </p>
    </div>
  );
}
