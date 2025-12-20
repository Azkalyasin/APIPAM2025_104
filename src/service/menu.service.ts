import prisma from '../config/database';
import { Prisma } from '@prisma/client';
import {
  CreateMenuRequest,
  UpdateMenuRequest,
  MenuFilterRequest,
  MenuResponse,
} from '../types/menu.type';

export const createMenu = async (data: CreateMenuRequest): Promise<MenuResponse> => {
  const menu = await prisma.menu.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category_id: data.categoryId,
      is_available: data.is_available ?? true,
      image_url: data.image_url,
      stock: data.stock,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    id: menu.id,
    name: menu.name,
    description: menu.description,
    price: Number(menu.price), // 🔥 FIX UTAMA
    image_url: menu.image_url,
    is_available: menu.is_available,
    stock: menu.stock,
    created_at: menu.created_at,
    updated_at: menu.updated_at,
    category: menu.category,
  };
};

export const getAllMenus = async (filter: MenuFilterRequest): Promise<MenuResponse[]> => {
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

  const menus = await prisma.menu.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return menus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    description: menu.description,
    price: Number(menu.price),
    image_url: menu.image_url,
    is_available: menu.is_available,
    stock: menu.stock,
    created_at: menu.created_at,
    updated_at: menu.updated_at,
    category: menu.category,
  }));
};

export const getMenuById = async (id: number): Promise<MenuResponse | null> => {
  const menu = await prisma.menu.findFirst({
    where: {
      id,
      deleted_at: null,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  if (!menu) return null;

  return {
    id: menu.id,
    name: menu.name,
    description: menu.description,
    price: menu.price.toNumber(), // ⬅️ FIX
    image_url: menu.image_url,
    is_available: menu.is_available,
    stock: menu.stock,
    created_at: menu.created_at,
    updated_at: menu.updated_at,
    category: menu.category,
  };
};

export const updateMenu = async (data: UpdateMenuRequest): Promise<MenuResponse> => {
  const { id, categoryId, ...rest } = data;

  const menu = await prisma.menu.update({
    where: { id },
    data: {
      ...rest,
      category_id: categoryId,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  return {
    id: menu.id,
    name: menu.name,
    description: menu.description,
    price: menu.price.toNumber(), // ⬅️ FIX
    image_url: menu.image_url,
    is_available: menu.is_available,
    stock: menu.stock,
    created_at: menu.created_at,
    updated_at: menu.updated_at,
    category: menu.category,
  };
};

export const deleteMenu = async (id: number) => {
  return prisma.menu.update({
    where: { id },
    data: {
      deleted_at: new Date(),
    },
  });
};
