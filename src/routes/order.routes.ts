import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, adminOnly, customerOnly } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, customerOnly, orderController.createOrderController);
router.get('/:id', authenticate, orderController.getOrderByIdController);
router.get('/', authenticate, customerOnly, orderController.getOrdersByUserController);
router.patch('/status', authenticate, adminOnly, orderController.updateOrderStatusController);

export default router;
