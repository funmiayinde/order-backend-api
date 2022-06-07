import axios from 'axios';
import config from 'config';
import { DELETE, GET, POST, PUT } from '../../utils/codes';
import { formatError } from '../schema';

/**
 * The Order Request class
 */
class OrderRequest {
  /**c
   * Get order by id
   * @param {String} token The request object
   * @param {String} uid The request object
   * @param {Object} params The request object
   * @return {Object} res The response object
   */
  static async getOrder(token: string, uid: string, params = {}) {
    const httpConfig = {
      method: GET,
      url: `${config.get('app.baseUrl')}/orders/${uid}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ...params,
      },
    };
    return axios.request(httpConfig)
      .then((response) => response.data)
      .catch((err) => formatError(err));
  }

  /**
   * Get order-list plans
   * @param {Object} token The request object
   * @param {Object} query The request object
   * @return {Object} res The response object
   */
  static async getOrders(token: string, query = {pagination: {}, filters: [] as any[]}) {
      const {pagination, filters,} = query;
      const httpConfig = {
        method: GET,
        url: `${config.get('app.baseUrl')}/orders`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...pagination,
          filters,
        },
      };
      return axios.request(httpConfig)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log('api-error:::', JSON.stringify(err.data));
        return formatError(err);
      });
  }
  /**
   * Get order-list plans
   * @param {Object} token The request object
   * @param {Object} data The request object
   * @return {Object} res The response object
   */
  static async createOrder(token: string, data= {} ) {
      console.log('data:::', data);
      const httpConfig = {
        method: POST,
        url: `${config.get('app.baseUrl')}/orders`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      };
      return axios.request(httpConfig)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log('api-error:::', JSON.stringify(err.data));
        return formatError(err);
      });
  }
  
  /**
   * Get order-list plans
   * @param {Object} token The request object
   * @param {String} uid The request object
   * @param {Object} data The request object
   * @return {Object} res The response object
   */
  static async updateOrder(token: string, uid: string, data= {} ) {
      console.log('data:::', data);
      const httpConfig = {
        method: PUT,
        url: `${config.get('app.baseUrl')}/orders/${uid}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      };
      return axios.request(httpConfig)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log('api-error:::', JSON.stringify(err.data));
        return formatError(err);
      });
  }
  
  /**
   * Get order-list plans
   * @param {Object} token The request object
   * @param {String} uid The request object
   * @return {Object} res The response object
   */
  static async deleteOrder(token: string, uid: string ) {
      const httpConfig = {
        method: DELETE,
        url: `${config.get('app.baseUrl')}/orders/${uid}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return axios.request(httpConfig)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log('api-error:::', JSON.stringify(err.data));
        return formatError(err);
      });
  }
}

export default OrderRequest;