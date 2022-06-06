/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import lang from '../v1/lang';
import AppError from '../lib/app-error';
import { StatusCodes } from 'http-status-codes';
import { firebase } from '../setup/database';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export default async (
  req: any | Request,
  res: Response,
  next: NextFunction,
) => {
  let token: string =
    req.body.token || req.query.token || req.headers['authorization'];

  if (token?.startsWith('Bearer')) token = token.replace('Bearer', '').trim();

  if (token) {
    try {
      const user: DecodedIdToken = await firebase.auth().verifyIdToken(token);
      console.log('verified-user:', user);
      if (user) {
        req.authId = user;
        req.user = user;
        req.headers['x-auth-token'] = token;
        req.headers['authorization'] = `Bearer ${token}`;
        req.headers['Authorization'] = `Bearer ${token}`;
        return next();
      }
    } catch (err) {
      console.log('verify-token-err:', err);
      return next(new AppError(err, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  } else {
    const appError = new AppError(lang.get('error').token_not_found, StatusCodes.UNAUTHORIZED);
    return next(appError);
  }
};
