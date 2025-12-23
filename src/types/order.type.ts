import { OrderStatus } from '@prisma/client';

export interface CreateOrderRequest {
  address: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrderItemResponse {
  id: number;
  menu_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;

  menu: {
    id: number;
    name: string;
    image_url?: string | null;
  };
}

export interface OrderResponse {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_price: number;
  address: string;
  created_at: Date;
  updated_at: Date;

  items: OrderItemResponse[];
}

export interface OrderListResponse {
  orders: OrderResponse[];
}

export interface OrderFilterRequest {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}
