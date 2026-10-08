import type { ReactNode } from 'react';

export function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium tracking-wide text-ink-secondary uppercase">{label}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}
