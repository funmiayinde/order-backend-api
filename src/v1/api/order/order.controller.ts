
import { AppController } from '../_core/app.controller';
import OrderProcessor from './order.processor';

/**
 * The OrderController
 * */
export class OrderController extends AppController{

  /**
   * @param {OrderProcessor} processor
   */
  constructor(processor: OrderProcessor) {
    super(processor);
  }

}

export default OrderController;
