/* eslint-disable @typescript-eslint/no-explicit-any */
import OrderRequest from './request';


/***
 * Order Processor class
 */
class OrderProcessor  {

    /**
	 * @param {Object} data The request object
	 * @return {Object} res The response object
	 */
	static processObject(data: any) {
		return data;
	}

    /**
	 * Get Orders
	 * @param {String} token The request object
	 * @param {String} query The request object
	 * @return {Object} res The response object
	 */
    static async getOrders(token: string, query = {pagination: {}, filters: [] as any}) {
        const { _meta:{ pagination }, data = []} = await OrderRequest.getOrders(token, query) || {};
        return this.processObject({ data, pagination });
    }

	/**
	 * Get Orders
	 * @param {String} token The request object
	 * @param {String} uid The request object
	 * @return {Object} res The response object
	 */
    static async getOrder(token: string, uid: string) {
        const { data = null} = await OrderRequest.getOrder(token, uid) || {};
        return this.processObject({ ...data });
    }

	/**
	 * Delete Order
	 * @param {String} token The request object
	 * @param {String} uid The request object
	 * @return {Object} res The response object
	 */
    static async deleteOrder(token: string, uid: string) {
        const { data = null} = await OrderRequest.deleteOrder(token, uid) || {};
        return this.processObject({ ...data });
    }
	
	/**
	 * Create Order
	 * @param {String} token The request object
	 * @param {Object} payload The request object
	 * @return {Object} res The response object
	 */
    static async createOrder(token: string, payload = {}) {
        const { data = null} = await OrderRequest.createOrder(token, payload) || {};
        return this.processObject({ ...data });
    }
	
	/**
	 * Create Order
	 * @param {String} token The request object
	 * @param {String} uid The request object
	 * @param {Object} payload The request object
	 * @return {Object} res The response object
	 */
    static async updateOrder(token: string, uid: string, payload = {}) {
        const { data = null} = await OrderRequest.updateOrder(token, uid, payload) || {};
        return this.processObject({ ...data });
    }
};

export default OrderProcessor;