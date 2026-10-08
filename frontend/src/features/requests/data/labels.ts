import type { BadgeTone } from '../../../shared/ui/Badge';
import type { Priority, ResolutionStatus, WorkflowStatus } from '../types';

interface Presentation {
  label: string;
  tone: BadgeTone;
}

export const WORKFLOW_STATUS: Record<WorkflowStatus, Presentation> = {
  in_review: { label: 'En revisión', tone: 'info' },
  pending_information: { label: 'Pendiente de información', tone: 'warning' },
  approved: { label: 'Aprobada', tone: 'good' },
  rejected: { label: 'Rechazada', tone: 'critical' },
};

export const PRIORITY: Record<Priority, Presentation> = {
  high: { label: 'Alta', tone: 'critical' },
  medium: { label: 'Media', tone: 'warning' },
  low: { label: 'Baja', tone: 'neutral' },
};

export const RESOLUTION_STATUS: Record<ResolutionStatus, Presentation> = {
  pending: { label: 'Pendiente', tone: 'warning' },
  in_progress: { label: 'En progreso', tone: 'info' },
  resolved: { label: 'Resuelta', tone: 'good' },
  cancelled: { label: 'Cancelada', tone: 'neutral' },
};
