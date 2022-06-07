import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppResponse from '../../../lib/app-response';
import AuthProcessor from './auth.processor';

/**
 * The AuthController
 * */
export class AuthController {

  constructor() {
    this.login = this.login.bind(this);
  }
  /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async login(req: Request,res: Response,next: NextFunction): Promise<unknown> {
    try {
      const authUser = await AuthProcessor.login(req.body);
      const meta = AppResponse.getSuccessMeta();
      return res.status(StatusCodes.OK).json(AppResponse.format(meta, authUser));
    } catch (e) {
      return next(e);
    }
  }
}
