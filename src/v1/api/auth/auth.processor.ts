import lang from '../../../v1/lang';
import AppError from '../../../lib/app-error';
import AuthValidation from './auth.validation';
import { StatusCodes } from 'http-status-codes';
import firebaseApp from 'firebase/compat/app';
import { firebaseConfig } from '../../../setup/database';

/**
 * Here's where all auth logic are done
 * @class {AuthProcessor}
 */
export default class AuthProcessor {
  constructor() {
    this.dbInit();
  }

  public dbInit() {
    firebaseApp.initializeApp(firebaseConfig);
  }
  /**
   * @param {Object} obj The payload for login
   * @return token
   */
  static async login(obj: Record<string, unknown | never>) {
    try {
      const validation = AuthValidation.login(obj);
      if (!validation.passed) {
        throw new AppError(lang.get('error').inputs,StatusCodes.BAD_GATEWAY,validation.errors);
      }
      const { email, password } = obj || {};
      const auth = await firebaseApp.auth().createUserWithEmailAndPassword(email as string, password as string);
      return auth;
    } catch (e) {
      throw e;
    }
  }
}
