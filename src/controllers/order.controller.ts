import { Request, Response } from 'express';
import * as orderService from '../service/order.service';
import logger from '../utils/logger';
import { OrderStatus } from '@prisma/client';
import { CreateOrderRequest } from '../types/order.type';

/* ================= CUSTOM REQUEST ================= */
interface AuthRequest extends Request {
  user?: {
    userId: string | number;
    email: string;
    role: string;
  };
}

/* ================= CREATE ORDER ================= */
export const createOrderController = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const body: CreateOrderRequest = req.body;
    const order = await orderService.createOrder(userId, body);

    logger.info(`Order created: ${order.order_number} by user ${userId}`);
    return res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      data: order,
    });
  } catch (error) {
    logger.error('Create order error', error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Gagal membuat order',
    });
  }
};

/* ================= GET ORDER BY ID ================= */
export const getOrderByIdController = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const order = await orderService.getOrderById(id);

    if (!order) {
      logger.warn(`Order not found: ${id}`);
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order berhasil diambil',
      data: order,
    });
  } catch (error) {
    logger.error('Get order by ID error', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil order',
    });
  }
};

/* ================= GET USER ORDERS ================= */
export const getOrdersByUserController = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = Number(req.user?.userId);
    const orders = await orderService.getOrdersByUser(userId);

    return res.status(200).json({
      success: true,
      message: 'Daftar order berhasil diambil',
      data: orders,
    });
  } catch (error) {
    logger.error('Get orders by user error', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil orders',
    });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatusController = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { orderNumber, status } = req.body as { orderNumber: string; status: OrderStatus };
    const order = await orderService.updateOrderStatus(orderNumber, status);

    logger.info(`Order status updated: ${orderNumber} -> ${status}`);
    return res.status(200).json({
      success: true,
      message: 'Status order berhasil diperbarui',
      data: order,
    });
  } catch (error) {
    logger.error('Update order status error', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Gagal update status order',
    });
  }
};
