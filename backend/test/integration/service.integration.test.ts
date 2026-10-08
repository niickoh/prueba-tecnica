import request from 'supertest';
import { describe, expect, it } from 'vitest';
import Service from '../../../Service';
import { createApp } from '../../src/app';
import { createUseCases } from '../../src/composition';
import { CachedOperationsService } from '../../src/infrastructure/services/cached-operations-service';

/**
 * Prueba de humo contra el `Service` real (con sus latencias simuladas):
 * confirma que los adaptadores entienden los datos provistos.
 */
describe('integration with the provided Service', () => {
  const app = createApp({
    useCases: createUseCases(new CachedOperationsService(new Service(), 60_000)),
    corsOrigins: ['http://localhost:5173'],
  });

  it('composes the detail of a request', { timeout: 15_000 }, async () => {
    const response = await request(app).get('/api/users/1/requests/300192').expect(200);

    expect(response.body).toMatchObject({
      id: 300192,
      category: { id: 'FINANCE', description: 'Administración financiera' },
      workflow: { status: 'rejected' },
      resolution: { status: 'cancelled' },
    });
  });

  it('maps a missing resource to 404', { timeout: 15_000 }, async () => {
    await request(app).get('/api/categories/UNKNOWN').expect(404);
  });
});
