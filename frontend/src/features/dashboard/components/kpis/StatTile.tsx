interface StatTileProps {
  label: string;
  value: string;
  hint: string;
}

export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4">
      <dt className="text-sm font-medium text-ink-secondary">{label}</dt>
      <dd className="order-first text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {value}
      </dd>
      <dd className="text-xs text-ink-secondary">{hint}</dd>
    </div>
  );
}
