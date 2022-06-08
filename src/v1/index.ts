import { Router } from 'express';

import auth from './api/auth/auth.route';
import order from './api/order/order.route';
import user from './api/user/user.route';

const router: Router = Router();

router.use(auth);
router.use(order);
router.use(user);

export default router;
