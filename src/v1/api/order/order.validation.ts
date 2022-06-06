/* eslint-disable @typescript-eslint/no-explicit-any */
import Validator from 'validatorjs';
import AppValidation from '../_core/app.validation';

/**
 * The OrderValidation  class
 * */
export default class OrderValidation extends AppValidation {
  /**
   * @param {Object} obj The object to validate
   * @return {Object} ValidatorD
   * */
  static create(obj: any | object): any | object {
    const rules: Validator.Rules = {
      name: 'required',
      options: 'required|array',
      'options*.description': 'required|string'
    };
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }
}
