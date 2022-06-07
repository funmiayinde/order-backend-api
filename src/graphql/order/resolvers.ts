import { isAuthenticatedResolver } from '../acl';
import OrderProcessor from './processor';


export default {
    Query: {
        getOrders: isAuthenticatedResolver.createResolver((root, { query}, {token}) => {
            return OrderProcessor.getOrders(token, query);
        }),
        getOrder: isAuthenticatedResolver.createResolver((root, { uid}, {token}) => {
            return OrderProcessor.getOrder(token, uid);
        }),
        deleteOrder: isAuthenticatedResolver.createResolver((root, { uid}, {token}) => {
            return OrderProcessor.getOrder(token, uid);
        }),
    },
    Mutation: {
        createOrder: isAuthenticatedResolver.createResolver((root, { createOrderInput }, {token}) => {
            return OrderProcessor.createOrder(token, createOrderInput);
        }),
        updateOrder: isAuthenticatedResolver.createResolver((root, { uid, updateOrderInput}, {token}) => {
            return OrderProcessor.updateOrder(token, uid, updateOrderInput);
        }),
    }
};