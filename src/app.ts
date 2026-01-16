import express from 'express';
console.log('🔥 MENU ROUTES LOADED');
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import menuRoutes from './routes/menu.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';

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
    version: '5.0.0',
  });
});

app.use('/api/v1', authRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', menuRoutes);
app.use('/api/v1', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
export default app;
