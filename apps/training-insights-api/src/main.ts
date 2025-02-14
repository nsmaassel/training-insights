import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createTRPCContext } from '@training-insights/shared/trpc';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

// Enable CORS for E2E tests
app.use(cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount tRPC router using shared configuration
app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: createTRPCContext
}));

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

// Export app for testing
export const server = app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server shutting down');
  });
});
