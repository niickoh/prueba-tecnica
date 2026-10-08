export function Spinner({ className = 'size-6' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-line border-t-accent motion-reduce:animate-none ${className}`}
    />
  );
}
