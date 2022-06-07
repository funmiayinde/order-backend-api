import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

const ctrl = new AuthController();

router.post('/auth/login', ctrl.login);

export default router;
