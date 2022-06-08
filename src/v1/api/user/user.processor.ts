/* eslint-disable @typescript-eslint/no-explicit-any */
import AppProcessor from '../_core/app.processor';
import UserValidation from './user.validation';

/**
 * The UserProcessor  class
 * */
class UserProcessor extends AppProcessor {

   /**
    * This returns the model or the resource name
   * @return {String}
   **/
  public getModelName(): string {
    return 'user';
  }

  /**
   * @return {UserValidation}
   **/
  public getValidator(): UserValidation {
    return new UserValidation();
  }
}

export default UserProcessor;
