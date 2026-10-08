import { existsSync } from 'node:fs';
import Service from '../../Service';
import { createApp } from './app';
import { createUseCases } from './composition';
import { loadConfig } from './config/env';
import { CachedOperationsService } from './infrastructure/services/cached-operations-service';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const config = loadConfig();
const service = new CachedOperationsService(new Service(), config.CACHE_TTL_MS);
const app = createApp({ useCases: createUseCases(service), corsOrigins: config.CORS_ORIGIN });

const server = app.listen(config.PORT, () => {
  console.log(`API listening on http://localhost:${config.PORT} (docs: /docs)`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
