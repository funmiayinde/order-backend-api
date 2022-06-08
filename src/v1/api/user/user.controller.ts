
import { AppController } from '../_core/app.controller';
import UserProcessor from './user.processor';

/**
 * The UserController
 * */
export class UserController extends AppController{

  /**
   * @param {UserProcessor} processor
   */
  constructor(processor: UserProcessor) {
    super(processor);
  }

}

export default UserController;
