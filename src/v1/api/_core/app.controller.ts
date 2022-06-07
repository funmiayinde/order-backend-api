/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { lowerCase } from 'lodash';
import { ValidationOption } from '../../../v1/types/validation-option';
import AppError from '../../../lib/app-error';
import QueryParser from '../../../lib/query-parser';
import lang from '../../lang/index';
import AppProcessor from './app.processor';
import Pagination from '../../../lib/pagination';

export abstract class AppController {
  protected processor: AppProcessor;
  protected lang: any;

  /**
   *@param {AppProcessor} processor The default model object
   * for the controller. Will be required to create
   * an instance of the controller
   * */
  constructor(processor: AppProcessor) {
    if (processor) {
      this.processor = processor;
      this.lang = lang.get(lowerCase(processor.getModelName()));
      this.uid = this.uid.bind(this);
      this.findOne = this.findOne.bind(this);
      this.create = this.create.bind(this);
      this.find = this.find.bind(this);
      this.update = this.update.bind(this);
      this.delete = this.delete.bind(this);
    }
  }

  /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @param {String} uid The id from the url parameter
   * @return {Object} res The response object
   */
  async uid(req: any | Request,res: any | Response,next: NextFunction,uid: string): Promise<any> {
    try {
      const queryParser: QueryParser = new QueryParser(
        Object.assign({}, req.query),
      );
      const { value } = await this.processor.findObject({uid}, queryParser);
      if (value) {
        req.object = value;
        return next();
      }
      const appError = new AppError(this.lang.not_found, StatusCodes.NOT_FOUND);
      return next(appError);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async findOne(req: any | Request, res: Response,next: NextFunction): Promise<any> {
    try {
      const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
      const response = await this.processor.getResponse({
        code: StatusCodes.OK,
        value: req.object,
        queryParser,
      });
      return res.status(StatusCodes.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }
  
  /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async create(req: any | Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
      const obj = req.body;
      const validate: ValidationOption = this.processor.getValidator().create(obj);
      if (!validate.passed){
        return next(new AppError(lang.get('error').input, StatusCodes.BAD_REQUEST, validate.errors));
      }
      const object = await this.processor.createNewObject(req.body);
      const response = await this.processor.getResponse({
        code: StatusCodes.CREATED,
        value: object,
        message: this.lang.created,
        queryParser,
      });
      return res.status(StatusCodes.CREATED).json(response);
    } catch (e) {
      return next(e);
    }
  }
  
  /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
      const pagination: Pagination = new Pagination(req.originalUrl);
      const {value, count} = await this.processor.buildModelQueryObject(pagination, queryParser);
      const response = await this.processor.getResponse({
        code: StatusCodes.OK,
        value,
        queryParser,
        pagination,
        count,
      });
      return res.status(StatusCodes.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }
  
  /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async update(req: any | Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
      const obj = req.body;
      const validate: ValidationOption = this.processor.getValidator().update(obj as never);
      if (!validate.passed){
        return next(new AppError(lang.get('error').input, StatusCodes.BAD_REQUEST, validate.errors));
      }
      let object = req.object;
      object = await this.processor.updateObject(object, obj);
      const response = await this.processor.getResponse({
        code: StatusCodes.OK,
        message: this.lang.updated,
        value: object,
        queryParser,
      });
      return res.status(StatusCodes.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }
  
  /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async delete(req: any | Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
      const object = await this.processor.deleteObject(req.object as never);
      const response = await this.processor.getResponse({
        code: StatusCodes.OK,
        message: this.lang.deleted,
        value: {uid: object},
        queryParser,
      });
      return res.status(StatusCodes.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }
}
