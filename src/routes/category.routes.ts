import { Router } from 'express';
import * as category from '../controllers/category.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/auth.middleware';

const router = Router();

router.get('/categories', authenticate, category.getCategories);
router.post('/categories', authenticate, adminOnly, category.createcategory);
router.get('/categories/:id', authenticate, category.getCategory);
router.put('/categories/:id', authenticate, adminOnly, category.updatecategory);
router.delete('/categories/:id', authenticate, adminOnly, category.deletecategory);

export default router;
