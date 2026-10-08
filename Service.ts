// istanbul ignore file

/**
 * - Todos estos métodos son asíncronos.
 * - No modifiques estos archivos: durante la revisión se usará una copia
 *   equivalente para validar el funcionamiento de tu solución.
 */

import MockUtils from './moks';

type HttpError = Error & { status: number };

function badRequestError(): HttpError {
  const error = new Error('Bad request') as HttpError;
  error.status = 400;
  return error;
}

export default class Service {
  mockUtils: MockUtils;

  constructor() {
    this.mockUtils = new MockUtils();
  }

  getUser() {
    return this.mockUtils.getUser();
  }

  getUserRestrictions(userId: string | number) {
    return this.mockUtils.getUserRestrictions(userId);
  }

  async getUserRequests(userId: string | number, limit = 10, page = 1) {
    if (!Number.isInteger(limit) || !Number.isInteger(page) || limit < 1 || page < 1) {
      throw badRequestError();
    }

    const requests = await this.mockUtils.getUserRequests(userId) as unknown[];
    const offset = (page - 1) * limit;

    if (offset >= requests.length) {
      throw badRequestError();
    }

    return {
      total: requests.length,
      offset,
      limit,
      data: requests.slice(offset, offset + limit),
    };
  }

  getCategory(categoryId: string | number) {
    return this.mockUtils.getCategory(categoryId);
  }

  getWorkflow(workflowId: string | number) {
    return this.mockUtils.getWorkflow(workflowId);
  }

  getResolution(resolutionId: string | number) {
    return this.mockUtils.getResolution(resolutionId);
  }
}
