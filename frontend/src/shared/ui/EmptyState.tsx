import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-2 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="text-sm text-ink-secondary">{description}</p>}
      {action}
    </div>
  );
}
