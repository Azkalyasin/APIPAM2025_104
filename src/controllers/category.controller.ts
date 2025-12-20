import type { Request, Response } from 'express';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} from '../service/category.service';
import logger from '../utils/logger';

export const createcategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const category = await createCategory({ name, description });

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat',
      data: category,
    });
  } catch (error) {
    logger.error('Create category error', error);
    res.status(500).json({ success: false });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    logger.error('Get categories error', error);
    res.status(500).json({ success: false });
  }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const category = await getCategoryById(id);

    if (!category) {
      res.status(404).json({ success: false });
      return;
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    logger.error('Get category by id error', error);
    res.status(500).json({ success: false });
  }
};

export const updatecategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    const category = await updateCategory({ id, name, description });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    logger.error('Update category error', error);
    res.status(500).json({ success: false });
  }
};

export const deletecategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const category = await deleteCategory(id);

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    logger.error('Delete category error', error);
    res.status(500).json({ success: false });
  }
};
