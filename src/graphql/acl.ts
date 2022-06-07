/* eslint-disable @typescript-eslint/camelcase */
import { StatusCodes } from 'http-status-codes';
import { ErrorConstants, GraphError } from './errors';
import { baseResolver } from './_core/baseResolver';

export const isAuthenticatedResolver = baseResolver.createResolver((root, args, context) => {
    if (!context.user) {
        const {name, not_logged_in} = ErrorConstants.AUTHENTICATION;
        if (context.authError){
            throw GraphError(name, context.authError.error, {
                code: StatusCodes.UNAUTHORIZED,
                message: 'UNAUTHORIZED'
            });
        }
        throw GraphError(name, not_logged_in, {
            code: StatusCodes.UNAUTHORIZED,
            message: 'UNAUTHORIZED'
        });
    }
});
