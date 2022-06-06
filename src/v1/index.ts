import { Router } from 'express';

import order from './api/order/order.route';

const router: Router = Router();

router.use(order);

export default router;
