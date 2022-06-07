/* eslint-disable @typescript-eslint/no-explicit-any */
import errorHandler from './middleware/error';
import Q from 'q';
import { Express, Request, Response, NextFunction } from 'express';
import AppError from './lib/app-error';
import { NOT_FOUND } from './utils/codes';
import apiV1 from './v1';
import server from './graphql/schema';

/**
 * The routes will add all the application defined routes
 * @param {app} app The app is an instance of an express application
 * @return {Promise<void>}
 * */
export default async (app: any | Express) => {
    app.use('/api/v1', apiV1);

    server.applyMiddleware({
        app,
        path: '/api/v1/graphql'
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
        const err: any = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
        return next(new AppError('not found', NOT_FOUND));
    });
    app.use(errorHandler);
    return Q.resolve(app);
};
