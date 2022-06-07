/* eslint-disable @typescript-eslint/camelcase */
import { ValidationOption } from '../../../v1/types/validation-option';
import Validator from 'validatorjs';

export default class AuthValidation {
  /**
   * @param {Object} obj The object to validate
   * @return {Object} ValidatorD
   * */
  static login(obj: never | object): ValidationOption {
    const rules: Validator.Rules = {
        email: 'required|email',
        password: 'required|min:8'
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
  static signUp(obj: never | object): ValidationOption {
    const rules: Validator.Rules = {
        email: 'required|email',
        password: 'required|min:8',
        confirm_password: 'required|min:8',
    };
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }
}
