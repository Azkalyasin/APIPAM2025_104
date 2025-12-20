import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/cart', authorize('CUSTOMER'), cartController.getMyCart);

router.post('/items', authorize('CUSTOMER'), cartController.addItemToCart);

router.put('/items', authorize('CUSTOMER'), cartController.updateCartItem);

router.delete('/items/:menuId', authorize('CUSTOMER'), cartController.removeCartItem);

router.delete('/cart', authorize('CUSTOMER'), cartController.clearCart);

export default router;
