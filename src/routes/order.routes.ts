import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, adminOnly } from '../middlewares/auth.middleware';

const router = Router();

router.get('/all', authenticate, adminOnly, orderController.getAllOrdersController);
router.post('/', authenticate, orderController.createOrderController);
router.get('/:id', authenticate, orderController.getOrderByIdController);
router.get('/', authenticate, orderController.getOrdersByUserController);
router.patch('/status', authenticate, adminOnly, orderController.updateOrderStatusController);

export default router;
