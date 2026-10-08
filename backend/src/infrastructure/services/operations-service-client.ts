/**
 * Contrato mínimo del `Service` provisto. Las respuestas se tratan como `unknown`
 * y se validan en los adaptadores de persistencia antes de entrar al dominio.
 */
export interface OperationsServiceClient {
  getUser(): Promise<unknown>;
  getUserRestrictions(userId: string | number): Promise<unknown>;
  getUserRequests(userId: string | number, limit?: number, page?: number): Promise<unknown>;
  getCategory(categoryId: string | number): Promise<unknown>;
  getWorkflow(workflowId: string | number): Promise<unknown>;
  getResolution(resolutionId: string | number): Promise<unknown>;
}
