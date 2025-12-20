export interface AddToCartRequest {
  menuId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  menuId: number;
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  quantity: number;

  menu: {
    id: number;
    name: string;
    price: number;
    image_url?: string | null;
  };

  subtotal: number;
}

export interface CartResponse {
  id: number;
  user_id: number;
  items: CartItemResponse[];
  total_quantity: number;
  total_price: number;
}
