/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationOption } from '../../../v1/types/validation-option';
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
  create(obj: any | object): ValidationOption {
    const rules: Validator.Rules = {
      title: 'required|string',
      bookingDate: 'required|date',
      address: 'required',
      'address.city': 'required|string',
      'address.street': 'required|string',
      'address.zip': 'required|string',
      customer: 'required',
      'customer.email': 'required|string',
      'customer.name': 'required|string',
      'customer.phone': 'required|string',
    };
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }

  /**
   * @param {Object} obj The object to validate
   * @return {Object} ValidatorD
   * */
  update(obj: any | object): ValidationOption {
    const rules: Validator.Rules = {};
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }
}
