/* eslint-disable @typescript-eslint/no-explicit-any */
import { isInstance } from 'apollo-errors';
import { isEmpty, merge } from 'lodash';
import { resolvers, types } from './index';
import {formatError as apolloFormatError} from 'apollo-errors/dist/index';
import { v4 } from 'uuid';
import { GraphError } from './errors';
import { Request } from 'express';
import { firebase } from '../setup/database';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import lang from '../v1/lang';
import { StatusCodes } from 'http-status-codes';
import { ApolloServer } from 'apollo-server-express';

const mergeResolvers = merge([...resolvers]);

if (process.env.NODE_ENV === 'development') {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const createGraphQLLogger = require('graphql-log');
  const logExecutions = createGraphQLLogger();
  logExecutions(resolvers);
}

/**
 * This function is run on each error passed back to the client
 * @param {*} error
 * @return {Object} res The response object
 */
export const formatError = (error: any): any => {
    // originalError contains the error before it was wrapped and located by Graphql
    const {originalError} = error;
    if (originalError && isInstance(originalError) || (error.message === 'ServerError')){
        console.log('originalError', error.extensions.exception.data);
        return apolloFormatError(error);
    }

    // Unknown error
    if (isEmpty(originalError)){
        const errorId = v4();
        let message = String(originalError);
        const name = message.indexOf('TypeError') > -1 ? 'BadRequest' : 'Internal';
        message = message.indexOf('TypeError') > - 1 ? message : 'Internal error. Please try again later.';
        return apolloFormatError(
            GraphError(name, message, {
                errorId,
                location: error.locations,
                path: error.path
            })
        );
    }
    const message = String(error);
    if (message.indexOf('ValidationError') > -1){
        const errorId = v4();
        return apolloFormatError(
            GraphError('ValidationError', message, {
                errorId,
                location: error.locations,
                path: error.path
            })
        );
    }

    console.log('web services error:::', error);
    let serviceError: unknown | never = {code: error.statusCode};
    if (error._meta && error._meta.error) {
        const {message, messages = null} = error.meta.error || {};
        serviceError = { ...serviceError as any, message, messages};
    }else {
        const {message, data = null} = error || {};
        serviceError = { ...serviceError as any, message, messages: data};
        throw GraphError('ServerError', error.message || 'Error processing request', {
            errorId: v4(),
            ...serviceError as any,
        });
    }
};

/**
 * This will setup auth seeded data
 *  @param {Object} req
 *  @return {Object}
 */
export const useTokenForUser = async (req: Request) => {
    let token: string =
    req.body.token || req.query.token || req.headers['authorization'];

  if (token?.startsWith('Bearer')) token = token.replace('Bearer', '').trim();

  const result: {authId: string; user: any; authError: any} = {authId: '', user: null, authError: null};
  if (token) {
      try {
        const user: DecodedIdToken = await firebase.auth().verifyIdToken(token);
        result.authId = user.uid;
        result.user = user;
      } catch(err) {
        result.authError  = {
            error: err.message || lang.get('error').token_not_found,
            code: StatusCodes.UNAUTHORIZED,
        };
      }
  }
  return result;
};

// GraphQL: Schema
const schema = new ApolloServer({
    typeDefs: [...types],
    resolvers: mergeResolvers,
    context: async ({req}) => {
        try{
            const {authId, user, authError} = await useTokenForUser(req);
            console.log('authId:::', authId);
            let context: any = {authId, user, authError};
            if (authId && user){
                context['user'] = user;
            }
            context = {
                ...context,
                token: req.headers['authorization'],
            };
            return context;
        }catch(e){
            console.log('gpl-err:', e);
        }
    },
    playground: {
        endpoint: '/api/v1/graphql',
        settings: {
            'editor.theme': 'dark',
        }
    },
    formatError,
});

export default schema;