import type { z } from 'zod';
import type { RequestRepository } from '../../application/requests/ports/request-repository';
import type { OperationalRequest } from '../../domain/requests/entities/operational-request';
import type { OperationsServiceClient } from '../services/operations-service-client';
import { serviceErrorStatus, translateServiceError } from './service-errors';
import {
  parseServiceResponse,
  rawRequestPageSchema,
  type rawRequestSchema,
} from './service-schemas';

type RawRequest = z.infer<typeof rawRequestSchema>;
type RawRequestPage = z.infer<typeof rawRequestPageSchema>;

/** Tamaño de lote al leer de `Service`: pocas llamadas para traer el conjunto completo. */
export const SERVICE_BATCH_SIZE = 100;

const EMPTY_PAGE: RawRequestPage = { total: 0, offset: 0, limit: SERVICE_BATCH_SIZE, data: [] };

function toOperationalRequest(raw: RawRequest): OperationalRequest {
  return {
    id: raw.request_id,
    subject: raw.subject,
    priority: raw.priority,
    categoryId: raw.category_id,
    createdAt: raw.created_at,
    requester: { id: raw.requester.id, name: raw.requester.name, area: raw.requester.area },
    workflowId: raw.workflow_id,
    resolutionId: raw.resolution_id,
  };
}

export class ServiceRequestRepository implements RequestRepository {
  constructor(private readonly service: OperationsServiceClient) {}

  /**
   * Los filtros deben aplicarse sobre el conjunto completo, así que se lee todo:
   * la primera página informa el total y el resto se pide en paralelo.
   */
  async findAllByUser(userId: number): Promise<OperationalRequest[]> {
    const first = await this.fetchPage(userId, 1);
    const pageCount = Math.ceil(first.total / SERVICE_BATCH_SIZE);
    const rest = await Promise.all(
      Array.from({ length: Math.max(pageCount - 1, 0) }, (_, index) =>
        this.fetchPage(userId, index + 2),
      ),
    );

    return [first, ...rest].flatMap((page) => page.data).map(toOperationalRequest);
  }

  private async fetchPage(userId: number, page: number): Promise<RawRequestPage> {
    try {
      const data = await this.service.getUserRequests(userId, SERVICE_BATCH_SIZE, page);
      return parseServiceResponse(rawRequestPageSchema, data, 'getUserRequests');
    } catch (error) {
      // `Service` responde 400 en la página 1 cuando el usuario no tiene solicitudes.
      if (page === 1 && serviceErrorStatus(error) === 400) {
        return EMPTY_PAGE;
      }
      throw translateServiceError(error, { resource: 'User', id: userId });
    }
  }
}
