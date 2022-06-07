import { Router } from 'express';

import auth from './api/auth/auth.route';
import order from './api/order/order.route';

const router: Router = Router();

router.use(auth);
router.use(order);

export default router;
