import { describeError } from '../../lib/errors';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ title, error, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="text-sm text-ink-secondary">{describeError(error)}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
