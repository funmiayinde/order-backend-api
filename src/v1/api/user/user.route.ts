/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Router } from 'express';
import auth from '../../../middleware/auth';
import { UserController } from './user.controller';
import UserProcessor from './user.processor';

const router = Router();

const ctrl = new UserController(new UserProcessor());

router.route('/users').post(auth, ctrl.create).get(auth, ctrl.find);

router.param('uid', ctrl.uid);
router
  .route('/users/:uid')
  .get(auth, ctrl.findOne)
  .put(auth, ctrl.update)
  .delete(auth, ctrl.delete);

export default router;
