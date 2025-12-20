import prisma from '../config/database';
import { AddToCartRequest, UpdateCartItemRequest, CartResponse } from '../types/cart.type';

/* ================= GET CART ================= */

export const getCartByUserId = async (userId: number): Promise<CartResponse> => {
  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
    include: {
      cart_items: {
        include: {
          menu: {
            select: {
              id: true,
              name: true,
              price: true,
              image_url: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    throw new Error('Cart tidak ditemukan');
  }

  let total_price = 0;
  let total_quantity = 0;

  const items = cart.cart_items.map((item) => {
    const price = Number(item.menu.price);
    const subtotal = price * item.quantity;

    total_price += subtotal;
    total_quantity += item.quantity;

    return {
      id: item.id,
      quantity: item.quantity,
      menu: {
        id: item.menu.id,
        name: item.menu.name,
        price,
        image_url: item.menu.image_url,
      },
      subtotal,
    };
  });

  return {
    id: cart.id,
    user_id: cart.user_id,
    items,
    total_price,
    total_quantity,
  };
};

/* ================= ADD TO CART ================= */

export const addToCart = async (userId: number, data: AddToCartRequest): Promise<CartResponse> => {
  const { menuId, quantity } = data;

  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new Error('Cart tidak ditemukan');
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cart_id_menu_id: {
        cart_id: cart.id,
        menu_id: menuId,
      },
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        menu_id: menuId,
        quantity,
      },
    });
  }

  return getCartByUserId(userId);
};

/* ================= UPDATE CART ITEM ================= */

export const updateCartItem = async (
  userId: number,
  data: UpdateCartItemRequest
): Promise<CartResponse> => {
  const { menuId, quantity } = data;

  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new Error('Cart tidak ditemukan');
  }

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: {
        cart_id: cart.id,
        menu_id: menuId,
      },
    });
  } else {
    await prisma.cartItem.updateMany({
      where: {
        cart_id: cart.id,
        menu_id: menuId,
      },
      data: { quantity },
    });
  }

  return getCartByUserId(userId);
};

/* ================= REMOVE ITEM ================= */

export const removeCartItem = async (userId: number, menuId: number): Promise<CartResponse> => {
  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new Error('Cart tidak ditemukan');
  }

  await prisma.cartItem.deleteMany({
    where: {
      cart_id: cart.id,
      menu_id: menuId,
    },
  });

  return getCartByUserId(userId);
};

/* ================= CLEAR CART ================= */

export const clearCart = async (userId: number): Promise<void> => {
  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cart_id: cart.id },
  });
};
