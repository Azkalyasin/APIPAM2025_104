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
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║ [${new Date().toISOString()}] UPDATE MENU`);
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    const id = Number(req.params.id);
    console.log(`📍 Menu ID: ${id}`);
    console.log(`📦 Request Body:`, req.body);

    if (!id || isNaN(id) || id <= 0) {
      console.log('❌ Invalid ID');
      res.status(400).json({ success: false, message: 'ID menu tidak valid' });
      return;
    }

    const { name, description, price, category_id, is_available, stock } = req.body;

    let imageUrl: string | undefined;
    if (req.file) {
      console.log('📷 Uploading image...');
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
      console.log(`✅ Image uploaded: ${imageUrl}`);
    }

    // ============================================
    // Build updateData dengan validasi ketat
    // ============================================
    const updateData: any = { id };

    // Name
    if (name && typeof name === 'string' && name.trim() !== '') {
      updateData.name = name.trim();
      console.log(`✓ name: "${updateData.name}"`);
    }

    // Description
    if (description !== undefined && description !== null) {
      updateData.description = typeof description === 'string' ? description.trim() : '';
      console.log(`✓ description: "${updateData.description}"`);
    }

    // Price - DENGAN VALIDASI
    if (price !== undefined && price !== null && price !== '') {
      const priceNum = parseFloat(price);
      if (!isNaN(priceNum) && priceNum > 0) {
        updateData.price = priceNum;
        console.log(`✓ price: ${updateData.price}`);
      } else {
        console.log(`⚠️  Invalid price: ${price}, skipping...`);
      }
    }

    // Category ID - DENGAN VALIDASI
    if (
      category_id !== undefined &&
      category_id !== null &&
      category_id !== '' &&
      category_id !== '0'
    ) {
      const catId = parseInt(category_id, 10);
      if (!isNaN(catId) && catId > 0) {
        updateData.categoryId = catId;
        console.log(`✓ categoryId: ${updateData.categoryId}`);
      } else {
        console.log(`⚠️  Invalid category_id: ${category_id}, skipping...`);
      }
    }

    // Stock - DENGAN VALIDASI
    if (stock !== undefined && stock !== null && stock !== '') {
      const stockNum = parseInt(stock, 10);
      if (!isNaN(stockNum) && stockNum >= 0) {
        updateData.stock = stockNum;
        console.log(`✓ stock: ${updateData.stock}`);
      } else {
        console.log(`⚠️  Invalid stock: ${stock}, skipping...`);
      }
    }

    // ============================================
    // FIX UTAMA: Convert is_available ke BOOLEAN
    // ============================================
    if (is_available !== undefined && is_available !== null && is_available !== '') {
      console.log(`🔍 is_available INPUT: "${is_available}" (type: ${typeof is_available})`);

      let boolValue: boolean;
      if (typeof is_available === 'boolean') {
        boolValue = is_available;
      } else if (typeof is_available === 'string') {
        const lowerStr = is_available.toLowerCase().trim();
        boolValue = lowerStr === 'true' || lowerStr === '1';
      } else if (typeof is_available === 'number') {
        boolValue = is_available === 1;
      } else {
        boolValue = Boolean(is_available);
      }

      updateData.is_available = boolValue;
      console.log(
        `✓ is_available OUTPUT: ${updateData.is_available} (type: ${typeof updateData.is_available})`
      );
    }

    // Image URL
    if (imageUrl) {
      updateData.image_url = imageUrl;
      console.log(`✓ image_url: ${imageUrl}`);
    }

    // ============================================
    // PENTING: Cleanup undefined values!
    // Prisma tidak terima undefined
    // ============================================
    console.log('\n🧹 Cleaning up undefined values...');
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
        console.log(`   ⚠️  Removed: ${key} (was undefined)`);
      }
    });

    console.log('\n📤 Final data to service:', JSON.stringify(updateData, null, 2));

    // Validate: Minimal ada 1 field selain id
    if (Object.keys(updateData).length === 1) {
      console.log('⚠️  No fields to update!');
      res.status(400).json({
        success: false,
        message: 'Tidak ada data yang diupdate',
      });
      return;
    }

    // Call service
    const menu = await updateMenu(updateData);

    if (!menu) {
      console.log('❌ Menu not found');
      res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
      return;
    }

    console.log('✅ SUCCESS!\n');
    logger.info('Menu updated', { menuId: id });

    res.status(200).json({
      success: true,
      message: 'Menu berhasil diupdate',
      data: menu,
    });
  } catch (error: any) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║ ❌ ERROR IN CONTROLLER');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('Error:', error);
    console.log('Message:', error?.message);
    console.log('Stack:', error?.stack);
    console.log('');

    logger.error('Update menu error', error);

    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate menu: ' + (error?.message || 'Unknown error'),
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
