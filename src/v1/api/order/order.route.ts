/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Router } from 'express';
import auth from '../../../middleware/auth';
import { OrderController } from './order.controller';
import OrderProcessor from './order.processor';

const router = Router();

const ctrl = new OrderController(new OrderProcessor());

router.route('/orders').post(auth, ctrl.create).get(auth, ctrl.find);

router.param('uid', ctrl.uid);
router
  .route('/orders/:uid')
  .get(auth, ctrl.findOne)
  .put(auth, ctrl.update)
  .delete(auth, ctrl.delete);

export default router;
