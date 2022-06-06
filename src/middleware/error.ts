/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response, NextFunction } from 'express';
import { CONFLICT, INTERNAL_SERVER_ERROR } from '../utils/codes';
import AppError from '../lib/app-error';
import config from 'config';
import AppResponse from '../lib/app-response';

export default (error: Error, req: Request, res: any | Response, next: NextFunction) => {
    const meta: any = {};
    
   if (error instanceof AppError) {
        const err = error.format();
        const code = err.code;
        meta.status_code = code;
        meta.error = { code, message: err.message };
        if (err.messages) {
            meta.error.messages = err.messages;
        }
    } else if (error instanceof Error) {
        meta.status_code = 500;
        meta.error = { code: INTERNAL_SERVER_ERROR, message: error.message };
        meta.developer_message = error;
    } else {
        const code = 500;
        meta.status_code = code;
        meta.error = { code: code, message: 'A problem with our server, please try again later. Thank you' };
        meta.developer_message = error;
    }
    if (`${config.util.getEnv('NODE_ENV')}` !== 'production') {
        console.log('error ====>>>>>>>>', error);
    }
    return res.status(meta.status_code).json(AppResponse.format(meta));
};
