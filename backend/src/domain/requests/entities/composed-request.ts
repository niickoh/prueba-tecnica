import type { Category } from './category';
import type { OperationalRequest } from './operational-request';
import type { Resolution } from './resolution';
import type { Workflow } from './workflow';

/** Solicitud con sus referencias resueltas (categoría y flujo). */
export interface ComposedRequest {
  request: OperationalRequest;
  category: Category;
  workflow: Workflow;
}

export interface ComposedRequestWithResolution extends ComposedRequest {
  resolution: Resolution;
}
