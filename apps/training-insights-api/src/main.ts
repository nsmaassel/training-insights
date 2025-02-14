import express from 'express';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

// Enable CORS for E2E tests
app.use(cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

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
