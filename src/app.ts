import express from 'express';
import helmet from 'helmet';
import { Request, Response } from 'express';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '🚀 API up and running',
    version: '1.0.0',
  });
});

export default app;
