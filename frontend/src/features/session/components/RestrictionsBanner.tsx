import { Alert } from '../../../shared/ui/Alert';
import { useSessionStore } from '../hooks/useSessionStore';

const toneByType = { warning: 'warning', error: 'critical' } as const;

function toneFor(type: string) {
  return type in toneByType ? toneByType[type as keyof typeof toneByType] : 'info';
}

export function RestrictionsBanner() {
  const restrictions = useSessionStore((state) => state.restrictions);
  if (restrictions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {restrictions.map((restriction) => (
        <Alert key={`${restriction.type}-${restriction.message}`} tone={toneFor(restriction.type)}>
          {restriction.message}
        </Alert>
      ))}
    </div>
  );
}
