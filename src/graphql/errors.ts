/* eslint-disable @typescript-eslint/camelcase */
import { createError } from 'apollo-errors';


/**
 * This function is run on each error passed back to the client
 * @param {String} name
 * @param {String} message
 * @param {Object} data
 * @return {Object} res The response object
 */
export const GraphError = (name: string, message: string, data = {}) => {
    const CustomError = createError(name, {message, data});
    return new CustomError;
};

export const ErrorConstants = {
    AUTHENTICATION: {
        name: 'Authentication',
        not_logged_in: 'You must be logged in to perform this action',
    },
    INPUT: {
        name: 'BadRequest',
        invalid_input: 'Your inputs are not valid'
    }
};