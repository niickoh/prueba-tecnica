import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-between gap-3">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <span aria-hidden="true">←</span> Anterior
      </Button>
      <p className="text-sm text-ink-secondary" aria-live="polite">
        Página <span className="font-semibold text-ink">{page}</span> de {totalPages}
      </p>
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente <span aria-hidden="true">→</span>
      </Button>
    </nav>
  );
}
