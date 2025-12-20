import { Request, Response } from 'express';
import * as cartService from '../service/cart.service';
import logger from '../utils/logger';

/* ================= CUSTOM REQUEST ================= */

interface AuthRequest extends Request {
  user?: {
    userId: string | number;
    email: string;
    role: string;
  };
}

/* ================= GET CART ================= */

export const getMyCart = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.user?.userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const cart = await cartService.getCartByUserId(userId);

    return res.status(200).json({
      success: true,
      message: 'Cart berhasil diambil',
      data: cart,
    });
  } catch (error) {
    logger.error('Get cart error', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil cart',
    });
  }
};

/* ================= ADD ITEM ================= */

export const addItemToCart = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.user?.userId);
    const { menuId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const cart = await cartService.addToCart(userId, {
      menuId,
      quantity,
    });

    return res.status(201).json({
      success: true,
      message: 'Item berhasil ditambahkan ke cart',
      data: cart,
    });
  } catch (error) {
    logger.error('Add cart item error', error);

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menambahkan item',
    });
  }
};

/* ================= UPDATE ITEM ================= */

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.user?.userId);
    const { menuId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const cart = await cartService.updateCartItem(userId, {
      menuId,
      quantity,
    });

    return res.status(200).json({
      success: true,
      message: 'Item cart berhasil diperbarui',
      data: cart,
    });
  } catch (error) {
    logger.error('Update cart item error', error);

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Gagal update cart',
    });
  }
};

/* ================= REMOVE ITEM ================= */

export const removeCartItem = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.user?.userId);
    const menuId = Number(req.params.menuId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const cart = await cartService.removeCartItem(userId, menuId);

    return res.status(200).json({
      success: true,
      message: 'Item berhasil dihapus dari cart',
      data: cart,
    });
  } catch (error) {
    logger.error('Remove cart item error', error);

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menghapus item',
    });
  }
};

/* ================= CLEAR CART ================= */

export const clearCart = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.user?.userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await cartService.clearCart(userId);

    return res.status(200).json({
      success: true,
      message: 'Cart berhasil dikosongkan',
    });
  } catch (error) {
    logger.error('Clear cart error', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal mengosongkan cart',
    });
  }
};
