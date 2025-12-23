import prisma from '../config/database';
import { OrderStatus } from '@prisma/client';
import { CreateOrderRequest, OrderResponse } from '../types/order.type';

// ============================
// HELPER MAPPER
// ============================
const mapOrderToResponse = (order: any): OrderResponse => {
  return {
    id: order.id,
    order_number: order.order_number,
    status: order.status,
    total_price: Number(order.total_price),
    address: order.address,
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: order.order_items.map((item: any) => ({
      id: item.id,
      menu_id: item.menu_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      subtotal: Number(item.subtotal),
      menu: item.menu
        ? {
            id: item.menu.id,
            name: item.menu.name,
            image_url: item.menu.image_url,
          }
        : undefined,
    })),
  };
};

// ============================
// CREATE ORDER (COD)
// ============================
export const createOrder = async (
  userId: number,
  data: CreateOrderRequest
): Promise<OrderResponse> => {
  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
    include: { cart_items: { include: { menu: true } } },
  });

  if (!cart || cart.cart_items.length === 0) {
    throw new Error('Cart is empty');
  }

  let totalPrice = 0;

  const orderItems = cart.cart_items.map((item) => {
    const subtotal = Number(item.menu.price) * item.quantity;
    totalPrice += subtotal;

    return {
      menu_id: item.menu_id,
      quantity: item.quantity,
      unit_price: item.menu.price,
      subtotal,
    };
  });

  const orderNumber = `ORD-${Date.now()}`;

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        user_id: userId,
        order_number: orderNumber,
        status: OrderStatus.PENDING, // COD → awal PENDING
        total_price: totalPrice,
        address: data.address,
        order_items: { create: orderItems },
      },
      include: {
        order_items: { include: { menu: { select: { id: true, name: true, image_url: true } } } },
      },
    });

    // Hapus semua item dari cart
    await tx.cartItem.deleteMany({ where: { cart_id: cart.id } });

    return createdOrder;
  });

  return mapOrderToResponse(order);
};

// ============================
// GET ORDER BY ID
// ============================
export const getOrderById = async (id: number): Promise<OrderResponse | null> => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      order_items: { include: { menu: { select: { id: true, name: true, image_url: true } } } },
    },
  });

  return order ? mapOrderToResponse(order) : null;
};

// ============================
// GET USER ORDERS
// ============================
export const getOrdersByUser = async (userId: number): Promise<OrderResponse[]> => {
  const orders = await prisma.order.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    include: {
      order_items: { include: { menu: { select: { id: true, name: true, image_url: true } } } },
    },
  });

  return orders.map(mapOrderToResponse);
};

// ============================
// UPDATE ORDER STATUS (ADMIN)
// ============================
export const updateOrderStatus = async (
  orderNumber: string,
  status: OrderStatus
): Promise<OrderResponse> => {
  const existingOrder = await prisma.order.findUnique({
    where: { order_number: orderNumber },
    include: {
      order_items: { include: { menu: { select: { id: true, name: true, image_url: true } } } },
    },
  });

  if (!existingOrder) {
    throw new Error(`Order dengan nomor ${orderNumber} tidak ditemukan`);
  }

  const order = await prisma.order.update({
    where: { order_number: orderNumber },
    data: { status },
    include: {
      order_items: { include: { menu: { select: { id: true, name: true, image_url: true } } } },
    },
  });

  return mapOrderToResponse(order);
};
