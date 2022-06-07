/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { extend, get, isArray, isEmpty, isString, merge } from 'lodash';
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
  /**
   * This returns the model or the resource name
   * @return {String}
   **/
  abstract getModelName(): string;

  /**
   * This returns the validation for the resource
   * @return {AppValidation}
   **/
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
    if (pagination && !queryParser.getAll) {
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
          console.log('filters:', queryParser.filters);
          console.log('isString:', isString(queryParser.filters));
          console.log('isString:', isString(queryParser.filters));
          query = this.applyFilters(query, filters) as never;
        }
        if (!queryParser.getAll) {
          //   query = query.orderBy(queryParser.sort) as never;
          query = query
            // .startAt(pagination.skip)
            .limit(pagination.perPage) as never;
        }
        if (queryParser.selection && queryParser.selection.length) {
          const selection: string[] = JSON.parse(queryParser.selection);
          console.log(
            'selection::',
            selection.map((s: string) => JSON.stringify(s)).join(','),
          );
          query = query.select(selection.join(',')) as never;
        }
      }
      const value = await query
        .get()
        .then((snapshot) =>
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        );
      //   const count = await db.collection(this.getModelName()).get().then((doc) => doc.size);
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
  async findObject(field: Record<string, any>, queryParser?: QueryParser) {
    try {
      let query = db.collection(this.getModelName()).where(Object.keys(field)[0], '==', Object.values(field)[0]);
      if (queryParser && queryParser.selection && queryParser.selection.length) {
        query = query.select(queryParser.selection.join(','));
      }
      let value;
      const data: any[] = (await query.get()).docs;
      if (data && data[0]){
          value = data[0].data();
      }
      return {
        query,
        value,
      };
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
        const uid = v4();
        await db.collection(this.getModelName()).add({
            ...obj,
            uid,
        });
        return { ...obj, uid};
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} current The payload object
   * @param {Object} obj The payload object
   * @return {Object}
   **/
  async updateObject(current: any, obj: Record<string, unknown>): Promise<any> {
    try {
      const { uid } = current || {};
      const { query } = await this.findObject({uid});
      const data = await query.get();
      await data.docs[0].ref.update(obj);
      return merge(current, obj);
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} current The payload object
   * @param {QueryParser} queryParser required for response
   * @return {Object}
   **/
  async deleteObject(current: never, queryParser?: QueryParser): Promise<string> {
    try {
      const { uid } = current || {};
      const field = queryParser && queryParser.query.deleteBy ? Object.keys(queryParser.query.deleteBy)[0] : '';
      const condition = !isEmpty(field) ? { [field]: get(current, field) } : { uid };
      const { query } = await this.findObject({...condition});
      const data = await query.get();
      await data.docs[0].ref.delete();
      return !isEmpty(field) ? get(current, field) :  uid ;
    } catch (e) {
      throw e;
    }
  }

  /***
   * @param {Object} query The query data
   * @param {Object} filters The filter data
   * @return {Object}
   */
  private applyFilters(query: any, filters: Record<any, any>[]) {
    return filters.reduce(
      (acc, filter) => acc.where(filter.field, filter.condition, filter.value),
      query,
    );
  }
}
