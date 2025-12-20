import {
  CreateMenu,
  getMenus,
  getMenu,
  updatemenu,
  deletemenu,
} from '../controllers/menu.controller';
import { Router } from 'express';
import { authenticate, authorize, adminOnly } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/menus', authenticate, authorize('ADMIN', 'CUSTOMER'), getMenus);

router.get('/menus/:id', authenticate, authorize('ADMIN', 'CUSTOMER'), getMenu);

router.post(
  '/menus',
  authenticate,
  adminOnly,
  authorize('ADMIN'),
  upload.single('image'),
  CreateMenu
);

router.put(
  '/menus/:id',
  authenticate,
  adminOnly,
  authorize('ADMIN'),
  upload.single('image'),
  updatemenu
);

router.delete('/menus/:id', authenticate, adminOnly, authorize('ADMIN'), deletemenu);

export default router;
