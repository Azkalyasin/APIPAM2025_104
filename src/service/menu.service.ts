import prisma from '../config/database';
import { Menu, Prisma } from '@prisma/client';
import { CreateMenu, UpdateMenu } from '../types/menu.type';

export const createMenu = async (data: CreateMenu): Promise<Menu> => {
  const { name, description, price, categoryId, is_available, image_url, stock } = data;

  return prisma.menu.create({
    data: {
      name: name,
      description: description,
      price: price,
      category_id: categoryId,
      is_available: is_available,
      image_url: image_url,
      stock: stock,
    },
  });
};

export const getAllMenus = async (filter: {
  categoryId?: number;
  is_available?: boolean;
  search?: string;
}) => {
  const where: Prisma.MenuWhereInput = {
    deleted_at: null,
  };

  if (filter.categoryId !== undefined) {
    where.category_id = filter.categoryId;
  }

  if (filter.is_available !== undefined) {
    where.is_available = filter.is_available;
  }

  if (filter.search) {
    where.name = {
      contains: filter.search,
      mode: 'insensitive',
    };
  }

  return prisma.menu.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
};

export const getMenuById = async (id: number): Promise<Menu | null> => {
  return prisma.menu.findUnique({
    where: { id },
  });
};

export const updateMenu = async (data: UpdateMenu): Promise<Menu> => {
  const { id, name, description, price, categoryId, is_available, image_url, stock } = data;

  return prisma.menu.update({
    where: { id },
    data: {
      name: name,
      description: description,
      price: price,
      category_id: categoryId,
      is_available: is_available,
      image_url: image_url,
      stock: stock,
    },
  });
};

export const deleteMenu = async (id: number): Promise<Menu> => {
  return prisma.menu.delete({
    where: { id },
  });
};
