import { Spinner } from './Spinner';

export function LoadingState({ label }: { label: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-12 text-ink-secondary">
      <Spinner className="size-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
