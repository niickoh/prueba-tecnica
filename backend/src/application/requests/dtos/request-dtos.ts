import type {
  ComposedRequest,
  ComposedRequestWithResolution,
} from '../../../domain/requests/entities/composed-request';
import type { Category } from '../../../domain/requests/entities/category';
import type { Priority } from '../../../domain/requests/entities/priority';
import type { RequestMetrics } from '../../../domain/requests/entities/request-metrics';
import type { Resolution, ResolutionStatus } from '../../../domain/requests/entities/resolution';
import type { Workflow, WorkflowStatus } from '../../../domain/requests/entities/workflow';
import type { Page } from '../../../domain/shared/entities/pagination';

export interface CategoryDto {
  id: string;
  description: string;
}

export interface WorkflowDto {
  id: number;
  status: WorkflowStatus;
}

export interface ResolutionDto {
  id: number;
  status: ResolutionStatus;
}

export interface RequestSummaryDto {
  id: number;
  subject: string;
  priority: Priority;
  createdAt: string;
  requester: { id: number; name: string; area: string };
  category: CategoryDto;
  workflow: WorkflowDto;
}

export interface RequestDetailDto extends RequestSummaryDto {
  resolution: ResolutionDto;
}

export interface PaginatedDto<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface RequestFilterOptionsDto {
  workflowStatuses: WorkflowStatus[];
  priorities: Priority[];
  categories: CategoryDto[];
}

/** Las métricas del dominio ya son un objeto plano serializable. */
export type RequestMetricsDto = RequestMetrics;

export const toCategoryDto = ({ id, description }: Category): CategoryDto => ({ id, description });

export const toWorkflowDto = ({ id, status }: Workflow): WorkflowDto => ({ id, status });

export const toResolutionDto = ({ id, status }: Resolution): ResolutionDto => ({ id, status });

export function toRequestSummaryDto({
  request,
  category,
  workflow,
}: ComposedRequest): RequestSummaryDto {
  return {
    id: request.id,
    subject: request.subject,
    priority: request.priority,
    createdAt: request.createdAt,
    requester: { ...request.requester },
    category: toCategoryDto(category),
    workflow: toWorkflowDto(workflow),
  };
}

export function toRequestDetailDto(composed: ComposedRequestWithResolution): RequestDetailDto {
  return { ...toRequestSummaryDto(composed), resolution: toResolutionDto(composed.resolution) };
}

export function toPaginatedDto<T, R>(page: Page<T>, map: (item: T) => R): PaginatedDto<R> {
  return {
    data: page.items.map(map),
    pagination: {
      page: page.page,
      limit: page.limit,
      total: page.total,
      totalPages: page.totalPages,
    },
  };
}
