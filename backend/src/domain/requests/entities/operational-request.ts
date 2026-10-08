import type { Priority } from './priority';

export interface Requester {
  id: number;
  name: string;
  area: string;
}

/** Solicitud tal como la entrega la fuente de datos, con referencias por id. */
export interface OperationalRequest {
  id: number;
  subject: string;
  priority: Priority;
  categoryId: string;
  /** ISO 8601 con el offset original, para no perder la zona horaria del solicitante. */
  createdAt: string;
  requester: Requester;
  workflowId: number;
  resolutionId: number;
}
