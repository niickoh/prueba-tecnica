import { useId, type ReactNode } from 'react';
import { Card } from '../../../shared/ui/Card';

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  const headingId = useId();
  return (
    <Card aria-labelledby={headingId} className={`flex flex-col gap-4 ${className ?? ''}`}>
      <header>
        <h2 id={headingId} className="text-base font-semibold text-ink">
          {title}
        </h2>
        <p className="text-sm text-ink-secondary">{description}</p>
      </header>
      {children}
    </Card>
  );
}
