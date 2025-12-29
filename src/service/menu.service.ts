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

export const updateMenu = async (data: UpdateMenuRequest): Promise<MenuResponse | null> => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║ [${new Date().toISOString()}] SERVICE: updateMenu`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('Input:', JSON.stringify(data, null, 2));

  try {
    const { id, categoryId, ...rest } = data;

    if (!id || id <= 0) {
      console.log('❌ Invalid ID\n');
      return null;
    }

    // Check menu exists
    console.log(`🔍 Finding menu ID ${id}...`);
    const existing = await prisma.menu.findUnique({ where: { id } });

    if (!existing || existing.deleted_at) {
      console.log('❌ Menu not found or deleted\n');
      return null;
    }

    console.log(`✅ Found: "${existing.name}"`);

    // ============================================
    // PENTING: Filter out undefined values
    // HANYA kirim field yang ADA NILAINYA
    // ============================================
    const updatePayload: any = {};

    if (rest.name !== undefined) {
      updatePayload.name = rest.name;
      console.log(`✓ name: "${rest.name}"`);
    }

    if (rest.description !== undefined) {
      updatePayload.description = rest.description;
      console.log(`✓ description: "${rest.description}"`);
    }

    if (rest.price !== undefined) {
      updatePayload.price = rest.price;
      console.log(`✓ price: ${rest.price}`);
    }

    if (categoryId !== undefined && categoryId > 0) {
      updatePayload.category_id = categoryId;
      console.log(`✓ category_id: ${categoryId}`);
    }

    if (rest.stock !== undefined) {
      updatePayload.stock = rest.stock;
      console.log(`✓ stock: ${rest.stock}`);
    }

    if (rest.image_url !== undefined) {
      updatePayload.image_url = rest.image_url;
      console.log(`✓ image_url: ${rest.image_url}`);
    }

    // ============================================
    // FIX KRITIS: is_available HARUS boolean
    // ============================================
    if (rest.is_available !== undefined) {
      // PAKSA convert ke boolean (=== true)
      const boolValue = rest.is_available === true;
      updatePayload.is_available = boolValue;

      console.log(`✓ is_available: ${boolValue} (type: ${typeof boolValue})`);
      console.log(`   [from: ${rest.is_available}, type: ${typeof rest.is_available}]`);
    }

    console.log('\n📤 Prisma update payload:');
    console.log(JSON.stringify(updatePayload, null, 2));

    // Execute update
    const updated = await prisma.menu.update({
      where: { id },
      data: updatePayload,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    console.log(`✅ Database updated successfully!`);
    console.log(`   Menu: "${updated.name}"`);
    console.log(`   is_available in DB: ${updated.is_available}\n`);

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      price: updated.price.toNumber(),
      image_url: updated.image_url,
      is_available: updated.is_available,
      stock: updated.stock,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
      category: updated.category,
    };
  } catch (error: any) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║ ❌ ERROR IN SERVICE');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('Error:', error);
    console.log('Message:', error?.message);
    console.log('Code:', error?.code);
    console.log('Meta:', error?.meta);
    console.log('');

    throw error;
  }
};

export const deleteMenu = async (id: number) => {
  return prisma.menu.update({
    where: { id },
    data: {
      deleted_at: new Date(),
    },
  });
};
