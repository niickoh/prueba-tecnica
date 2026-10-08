import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app';
import { createUseCases } from '../../src/composition';
import { FakeService, mockDataset } from '../helpers/fake-service';

function buildApp(service = new FakeService()) {
  const logger = { error: vi.fn() };
  const app = createApp({
    useCases: createUseCases(service),
    corsOrigins: ['http://localhost:5173'],
    logger,
  });
  return { app, logger };
}

describe('GET /api/users/me', () => {
  it('returns the current user', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/me').expect(200);

    expect(response.body).toEqual({
      id: 1,
      name: 'Alex',
      surname: 'Morgan',
      fullName: 'Alex Morgan',
      area: 'Operaciones',
      profileImage: 'https://picsum.photos/180',
    });
  });
});

describe('GET /api/users/:userId/restrictions', () => {
  it('returns the user restrictions', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/1/restrictions').expect(200);

    expect(response.body).toEqual([
      { type: 'warning', message: 'Tu cuenta no ha sido verificada aún. Revisa tu mail' },
    ]);
  });

  it('returns 404 for an unknown user', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/99/restrictions').expect(404);

    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});

describe('GET /api/users/:userId/requests', () => {
  it('returns a page of composed requests with pagination metadata', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/1/requests?limit=2').expect(200);

    expect(response.body.pagination).toEqual({ page: 1, limit: 2, total: 10, totalPages: 5 });
    expect(response.body.data[0]).toEqual({
      id: 300200,
      subject: 'Acceso temporal a reportes regionales',
      priority: 'high',
      createdAt: '2022-07-25T10:23:18.000-03:00',
      requester: { id: 4010, name: 'Jordan Lee', area: 'Planificación' },
      category: { id: 'ACCESS', description: 'Accesos y permisos' },
      workflow: { id: 1000010200, status: 'pending_information' },
    });
  });

  it('filters by status, priority and category', async () => {
    const { app } = buildApp();

    const response = await request(app)
      .get('/api/users/1/requests')
      .query({ status: 'in_review', priority: 'low', category: 'FINANCE' })
      .expect(200);

    expect(response.body.data.map((item: { id: number }) => item.id)).toEqual([300195]);
  });

  it('rejects invalid query parameters with details per field', async () => {
    const { app } = buildApp();

    const response = await request(app)
      .get('/api/users/1/requests')
      .query({ page: 0, limit: 1000, status: 'done' })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details.map((issue: { path: string }) => issue.path)).toEqual([
      'page',
      'limit',
      'status',
    ]);
  });

  it('returns 400 for a page out of range', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/1/requests?page=3').expect(400);

    expect(response.body.error.code).toBe('PAGE_OUT_OF_RANGE');
  });

  it('returns an empty list for a user without requests', async () => {
    const service = new FakeService({ ...mockDataset(), requests: { 1: [] } });
    const { app } = buildApp(service);

    const response = await request(app).get('/api/users/1/requests').expect(200);

    expect(response.body).toEqual({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  });

  it('returns 404 for an unknown user', async () => {
    const { app } = buildApp();

    await request(app).get('/api/users/99/requests').expect(404);
  });
});

describe('GET /api/users/:userId/requests/:requestId', () => {
  it('returns the detail including the resolution status', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/1/requests/300197').expect(200);

    expect(response.body).toMatchObject({
      id: 300197,
      requester: { name: 'Taylor Chen' },
      workflow: { status: 'pending_information' },
      resolution: { id: 7010197, status: 'pending' },
    });
  });

  it('returns 404 when the request does not belong to the user', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/1/requests/123').expect(404);

    expect(response.body.error.message).toContain('123');
  });

  it('returns 400 for a non numeric id', async () => {
    const { app } = buildApp();

    await request(app).get('/api/users/1/requests/abc').expect(400);
  });
});

describe('GET /api/users/:userId/requests/metrics', () => {
  it('returns the dashboard metrics computed over every request', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/1/requests/metrics').expect(200);

    expect(response.body).toMatchObject({
      total: 10,
      openWorkflows: 4,
      pendingInformation: 2,
      highPriorityUnresolved: 2,
      byWorkflowStatus: { in_review: 2, pending_information: 2, approved: 5, rejected: 1 },
      byPriority: { high: 4, medium: 4, low: 2 },
    });
    expect(response.body.approvalRate).toBeCloseTo(5 / 6);
  });
});

describe('GET /api/users/:userId/requests/filter-options', () => {
  it('returns statuses, priorities and the categories present in the requests', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/api/users/1/requests/filter-options').expect(200);

    expect(response.body.categories.map((category: { id: string }) => category.id)).toEqual([
      'ACCESS',
      'FINANCE',
      'DATA',
    ]);
    expect(response.body.priorities).toEqual(['high', 'medium', 'low']);
  });
});

describe('catalog endpoints', () => {
  it.each([
    ['/api/categories/DATA', { id: 'DATA', description: 'Datos maestros' }],
    ['/api/workflows/1000010192', { id: 1000010192, status: 'rejected' }],
    ['/api/resolutions/7010193', { id: 7010193, status: 'in_progress' }],
  ])('GET %s', async (path, expected) => {
    const { app } = buildApp();

    const response = await request(app).get(path).expect(200);

    expect(response.body).toEqual(expected);
  });

  it.each(['/api/categories/NOPE', '/api/workflows/1', '/api/resolutions/1'])(
    'GET %s returns 404',
    async (path) => {
      const { app } = buildApp();

      await request(app).get(path).expect(404);
    },
  );
});

describe('error handling', () => {
  it('returns 502 without leaking details when Service returns unexpected data', async () => {
    const service = new FakeService({ ...mockDataset(), user: { unexpected: true } });
    const { app, logger } = buildApp(service);

    const response = await request(app).get('/api/users/me').expect(502);

    expect(response.body).toEqual({
      error: { code: 'UPSTREAM_SERVICE_ERROR', message: 'The data source is unavailable' },
    });
    expect(logger.error).toHaveBeenCalled();
  });

  it('returns 404 for unknown routes', async () => {
    const { app } = buildApp();

    await request(app).get('/api/unknown').expect(404);
  });
});

describe('documentation', () => {
  it('serves an OpenAPI document generated from the route schemas', async () => {
    const { app } = buildApp();

    const response = await request(app).get('/docs/openapi.json').expect(200);

    expect(Object.keys(response.body.paths)).toEqual(
      expect.arrayContaining([
        '/users/me',
        '/users/{userId}/restrictions',
        '/users/{userId}/requests',
        '/users/{userId}/requests/{requestId}',
        '/categories/{categoryId}',
        '/workflows/{workflowId}',
        '/resolutions/{resolutionId}',
      ]),
    );
    expect(response.body.components.schemas).toHaveProperty('RequestSummary');
  });
});
