/* eslint-disable @typescript-eslint/no-explicit-any */
import AppProcessor from '../_core/app.processor';
import OrderValidation from './order.validation';
import { getUnixTime } from 'date-fns';
import { get } from 'lodash';

/**
 * The OrderProcessor  class
 * */
class OrderProcessor extends AppProcessor {

   /**
    * This returns the model or the resource name
   * @return {String}
   **/
  public getModelName(): string {
    return 'order';
  }

  /**
   * @return {OrderValidation}
   **/
  public getValidator(): OrderValidation {
    return new OrderValidation();
  }

  /**
   * @param {Object} obj The payload object
   * @return {Object}
   **/
  public async createNewObject(obj: Record<any, any>): Promise<any> {
    obj.bookingDate = getUnixTime(get(obj, 'bookingDate') as Date);
    return await super.createNewObject(obj as Record<string, never>);
  }
}

export default OrderProcessor;
