import { ButtonLink } from '../shared/ui/ButtonLink';
import { EmptyState } from '../shared/ui/EmptyState';
import { PageHeader } from '../shared/ui/PageHeader';

export function NotFoundPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Página no encontrada" />
      <EmptyState
        title="La dirección no existe"
        description="Revisá el enlace o volvé al inicio."
        action={<ButtonLink to="/">Ir al dashboard</ButtonLink>}
      />
    </div>
  );
}
