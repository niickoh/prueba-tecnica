export const RESOLUTION_STATUSES = ['pending', 'in_progress', 'resolved', 'cancelled'] as const;

export type ResolutionStatus = (typeof RESOLUTION_STATUSES)[number];

export interface Resolution {
  id: number;
  status: ResolutionStatus;
}

const FINISHED_RESOLUTION_STATUSES: ReadonlySet<ResolutionStatus> = new Set([
  'resolved',
  'cancelled',
]);

/** Una resolución termina cuando se resolvió o se canceló. */
export function isResolutionFinished(status: ResolutionStatus): boolean {
  return FINISHED_RESOLUTION_STATUSES.has(status);
}
