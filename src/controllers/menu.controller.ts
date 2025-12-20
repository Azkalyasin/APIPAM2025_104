import type { Response, Request } from 'express';
import type { MulterRequest } from '../types/multer-request';
import {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} from '../service/menu.service';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';
import logger from '../utils/logger';

export const CreateMenu = async (req: MulterRequest, res: Response): Promise<Response> => {
  try {
    logger.info('Create menu request', { body: req.body });

    const { name, description, price, category_id, stock } = req.body;

    let imageUrl: string | undefined;

    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const menu = await createMenu({
      name,
      description,
      price: Number(price),
      categoryId: Number(category_id),
      is_available: true,
      image_url: imageUrl,
      stock: stock ? Number(stock) : undefined,
    });

    logger.info('Menu created successfully', { menuId: menu.id });

    return res.status(201).json({
      success: true,
      message: 'Menu berhasil ditambahkan',
      data: menu,
    });
  } catch (error) {
    logger.error('Create menu error', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan menu',
    });
  }
};

export const getMenus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, is_available, search } = req.query;

    const filter = {
      categoryId: categoryId ? Number(categoryId) : undefined,
      is_available: is_available ? is_available === 'true' : undefined,
      search: search ? String(search) : undefined,
    };

    const menus = await getAllMenus(filter);

    logger.info('Get menus', { filter, count: menus.length });

    res.status(200).json({ success: true, data: menus });
  } catch (error) {
    logger.error('Get menus error', error);
    res.status(500).json({ success: false });
  }
};

export const getMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const menu = await getMenuById(id);

    if (!menu) {
      res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
      return;
    }

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    logger.error('Get menu error', error);
    res.status(500).json({ success: false });
  }
};

export const updatemenu = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, categoryId, is_available, stock } = req.body;

    let imageUrl: string | undefined;

    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const menu = await updateMenu({
      id,
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
      categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      is_available,
      stock: stock !== undefined ? Number(stock) : undefined,
      image_url: imageUrl,
    });

    logger.info('Menu updated', { menuId: id });

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    logger.error('Update menu error', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate menu',
    });
  }
};

export const deletemenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const menu = await deleteMenu(id);

    logger.warn('Menu deleted', { menuId: id });

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    logger.error('Delete menu error', error);
    res.status(500).json({ success: false });
  }
};
