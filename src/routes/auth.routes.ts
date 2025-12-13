import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
} from '../middlewares/validate.middleware';

const router = Router();

router.post('/register', validateRegister, authController.register);

router.post('/login', validateLogin, authController.login);

router.post('/refresh', validateRefreshToken, authController.refresh);

router.get('/me', authenticate, authController.getProfile);

router.post('/logout', authenticate, authController.logout);

export default router;
