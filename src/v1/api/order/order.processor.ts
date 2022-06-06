/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../../lib/app-error';
import { BAD_REQUEST } from '../../../utils/codes';
import lang from '../../lang';
import Pagination from '../../../lib/pagination';
import QueryParser from '../../../lib/query-parser';
import AppProcessor from '../_core/app.processor';
import AppValidation from '../_core/app.validation';
import OrderValidation from './order.validation';

/**
 * The OrderProcessor  class
 * */
class OrderProcessor extends AppProcessor {
  public getModelName(): string {
    return 'order';
  }
  public getValidator(): OrderValidation {
    return new OrderValidation();
  }
}

export default OrderProcessor;
