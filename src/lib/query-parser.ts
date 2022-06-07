/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject, isString, omit } from 'lodash';

/**
 * The QueryParser class
 * */
class QueryParser {
  private _query: any;
  private _all: any;
  private _sort: any;
  private _filters: any;
  private _selection: any;

  /**
   * @constructor
   * @param {Object} query This is a query object of the request
   * */
  constructor(query: any | object) {
    this._query = query;
    this.initialize(query);
    const excluded: string[] = [
      'per_page',
      'page',
      'limit',
      'sort',
      'all',
      'filters',
      'selection',
    ];
    // omit special query string keys from query before passing down to the model for filtering
    this._query = omit(this._query, ...excluded);
    Object.assign(this, this._query);
  }

  /**
   * Initialize all the special object required for the find query
   * @param {Object} query This is a query object of the request
   * */
  initialize(query: any | object) {
    this._all = query.all;
    this._sort = query.sort;
    if (query.selection) {
      this.selection = query.selection;
    }
    if (query.filters) {
      try {
        this._filters = JSON.parse(query.filters);
      } catch (e) {
        console.log('filter-error:', e);
      }
    }
  }

  /**
   * @return {Object} get the parsed query
   * */
  get query() {
    return this._query;
  }

  /**
   * @return {Object} get the parsed query
   * */
  get filters() {
    return this._filters;
  }

  /**
   * @return {Boolean} get the value for all data request
   * */
  get getAll() {
    return this._all;
  }

  /**
   * @return {Object} get the parsed query
   * */
  get selection() {
    if (this._selection) {
      return this._selection;
    }
    return [];
  }

  /**
   * @param {Object} value is the selection object
   * */
  set selection(value) {
    this._selection = value;
  }

  /**
   * when String i.e ?sort=name it is sorted by name ascending order
   * when Object ?sort[name]=desc { name: 'desc'} it is sorted by name descending order
   * when Object ?sort[name]=desc,sort[age]=asc {name: 'desc', age: 'asc'} it is sorted by name desc and age asc order
   */
  get sort() {
    if (this._sort) {
      if (isObject(this._sort)) {
        try {
          this._sort = JSON.parse(this._sort as any);
        } catch (e) {
          return [this._sort];
        }
      }
      for (const [column, direction] of Object.entries(this._sort)) {
        if (isString(direction))
          this._sort[column] =
            direction.toLowerCase() === 'asc'
              ? { ascending: true }
              : {
                  descending: true,
                };
      }
      return this._sort;
    }
    return 'bookingDate';
  }
}

export default QueryParser;
