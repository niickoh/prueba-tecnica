import { useLocation, useParams } from 'react-router';
import { ButtonLink } from '../../../../shared/ui/ButtonLink';
import { ErrorState } from '../../../../shared/ui/ErrorState';
import { LoadingState } from '../../../../shared/ui/LoadingState';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { useCurrentUser } from '../../../session/hooks/useCurrentUser';
import { useRequestDetail } from '../../hooks/useRequestDetail';
import { RequestDetailContent } from './RequestDetailContent';

function useBackToListHref(): string {
  const { state } = useLocation() as { state: { listSearch?: unknown } | null };
  const search = typeof state?.listSearch === 'string' ? state.listSearch : '';
  return search ? `/requests?${search}` : '/requests';
}

export function RequestDetailPage() {
  const user = useCurrentUser();
  const { requestId } = useParams();
  const detail = useRequestDetail(user.id, requestId);
  const backHref = useBackToListHref();

  const backLink = (
    <ButtonLink to={backHref} variant="ghost" className="-ml-4 self-start">
      <span aria-hidden="true">←</span> Volver al listado
    </ButtonLink>
  );

  if (detail.status === 'loading') {
    return (
      <div className="flex flex-col gap-4">
        {backLink}
        <LoadingState label="Cargando solicitud…" />
      </div>
    );
  }

  if (detail.status === 'error') {
    return (
      <div className="flex flex-col gap-4">
        {backLink}
        <ErrorState
          title="No pudimos mostrar la solicitud"
          error={detail.error}
          onRetry={detail.retry}
        />
      </div>
    );
  }

  const request = detail.data;
  return (
    <article className="flex flex-col gap-6">
      <PageHeader title={request.subject} description={`Solicitud #${request.id}`}>
        {backLink}
      </PageHeader>
      <RequestDetailContent request={request} />
    </article>
  );
}
