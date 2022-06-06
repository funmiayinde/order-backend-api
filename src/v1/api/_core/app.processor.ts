/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { extend, merge } from 'lodash';
import QueryParser from '../../../lib/query-parser';
import AppResponse from '../../../lib/app-response';
import ResponseOption from '../../../v1/types/response-option';
import Pagination from '../../../lib/pagination';
import { db } from '../../../setup/database';
import { v4 } from 'uuid';
import AppValidation from './app.validation';

/**
 * The AppProcessor class
 * This is the parent processor where other services inherit from
 */
export default abstract class AppProcessor {

  abstract getModelName(): string;
  
  abstract getValidator(): AppValidation;

  /**
   * @param {Object} obj required for response
   * @param {Object} value
   * @param {Number} code
   * @param {Object} message
   * @param {QueryParser} queryParser
   * @param {Pagination} pagination
   * @param {Number} count
   * @param {Object} token
   * @return {Promise<Object>}
   **/
  async getResponse({
    token,
    value,
    code,
    message,
    pagination,
    queryParser,
    count,
  }: ResponseOption) {
    const meta = AppResponse.getSuccessMeta();
    if (token) {
      extend(meta, { token });
    }
    extend(meta, { status_code: code });
    if (message) {
      extend(meta, { message });
    }
    if (pagination && queryParser && queryParser.getAll) {
      pagination.totalCount = count;
      if (pagination.morePages(count)) {
        pagination.next = pagination.current + 1;
      }
      meta.pagination = pagination.done();
    }
    return AppResponse.format(meta, value);
  }

  /**
   * @param {Pagination | Any} pagination The pagination for object
   * @param {QueryParser | Any} queryParser The query parser
   * @return {Object}
   * */
  async buildModelQueryObject(
    pagination: Pagination,
    queryParser: QueryParser,
  ) {
    try {
      let query = db.collection(this.getModelName());
      if (queryParser) {
        if (queryParser.filters) {
          const filters = queryParser.filters as Record<string, any>[];
          query = this.applyFilters(query, filters) as never;
        }
        if (!queryParser.getAll) {
          query = query
            .offset(pagination.skip)
            .limit(pagination.perPage) as never;
        }
        if (queryParser.selection) {
          query = query.select(queryParser.selection) as never;
        }
        query = query.orderBy(queryParser.sort) as never;
      }

      const value = await query
        .get()
        .then((snapshot) =>
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        );
      const count = await query.get().then((doc) => doc.size);
      return { value, count };
    } catch (e) {
      throw e;
    }
  }

  /***
   * @param {Object} query required for response
   * @param {QueryParser} queryParser required for response
   * @param {AppModel | Any} model The model object
   * @return {Object}
   */
  async findObject(uid: string, queryParser?: QueryParser): Promise<any> {
    try {
      let query = db.collection(this.getModelName());
      if (queryParser) {
        if (queryParser.selection) {
          query = query.select(queryParser.selection) as never;
        }
      }
      return query.doc(uid).get().then((doc) => doc);
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} obj The payload object
   * @return {Object}
   **/
  async createNewObject(obj: Record<string, never>): Promise<any> {
    try {
      return await db
        .collection(this.getModelName())
        .add({
          ...obj,
          uid: v4(),
        })
        .then((doc) => doc);
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} current The payload object
   * @param {Object} obj The payload object
   * @return {Object}
   **/
  async updateObject(
    current: any,
    obj: Record<string, unknown>,
  ): Promise<any> {
    try {
      const { uid } = current || {};
      const value = await db.collection(this.getModelName()).doc(uid).set(obj);
      return merge(current, value);
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} current The payload object
   * @return {Object}
   **/
  async deleteObject(current: never): Promise<any> {
    try {
      const { uid } = current || {};
      await db.collection(this.getModelName()).doc(uid).delete();
      return uid;
    } catch (e) {
      throw e;
    }
  }

  /***
   * @param {Object} query The query data
   * @param {Object} filter The filter data
   * @return {Object}
   */
  private applyFilters(query: unknown, filter: Record<any, any>[]) {
    return filter.reduce(
      (acc, filter) => acc.where(filter.field, filter.condition, filter.value),
      query,
    );
  }
}
