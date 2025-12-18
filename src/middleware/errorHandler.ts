// src/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '@/lib/winston';
import {TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { hash } from 'bcrypt';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
    http_code?: number
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

Sentry.withScope((scope) => {
        // Request Info
        scope.setTag('path', req.path);
        scope.setTag('method', req.method);
        scope.setTag('host', req.hostname);
        
        // Error Info
        if (err.statusCode) {
            scope.setTag('statusCode', err.statusCode.toString());
        }
        if (err.code) {
            scope.setTag('errorCode', err.code);
        }
        
        // User Context (wenn verfügbar)
        if (req.user) {
            scope.setUser({
                id: req.user.id,
                email: req.user.email,
                ip: req.ip
            });
        } else {
            scope.setUser({ ip: req.ip });
        }
        
        // Extra Daten
        scope.setExtra('query', req.query);
        scope.setExtra('params', req.params);
        scope.setExtra('body', {
            // Sensitive Daten maskieren
            ...req.body,
            password: req.body.password ? '***' : undefined,
            token: req.body.token ? '***' : undefined
        });
        scope.setExtra('headers', {
            'user-agent': req.headers['user-agent'],
            'content-type': req.headers['content-type']
        });
        scope.setExtra('stack', err.stack);
        
        // 2. Sentry Error senden - ABER nur bei Server Errors (5xx)
        // ODER bei kritischen Business Errors
        const isServerError = !err.statusCode || err.statusCode >= 500;
        const isCriticalError = [
            'DatabaseError', 
            'ExternalServiceError', 
            'PaymentError'
        ].includes(err.code || '');
        
        if (isServerError || isCriticalError) {
            Sentry.captureException(err);
        } else {
            // Client Errors (4xx) nur als Message (kein Alert)
            Sentry.captureMessage(`Client Error: ${err.message}`, {
                level: 'warning',
                tags: { type: 'client_error' }
            });
        }
    });

        // JWT Errors abfangen
    if (err instanceof TokenExpiredError) {
         res.status(401).json({
            code: 'TokenExpiredError',
            message: 'Refresh token expired, please login again',
            source: 'jwt'
        });
        return
    }
    
    if (err instanceof JsonWebTokenError) {
         res.status(401).json({
            code: 'InvalidTokenError', 
            message: 'Invalid refresh token',
            source: 'jwt'

        });
        return
    }

    if (err.statusCode && err.code) {
        res.status(err.statusCode).json({
            code: err.code,
            message: err.message,
            source: 'application (new Error())'

        });
        return;
    }


    //TYPE GAURD FUNCTION

    //const isCloudinaryError = (err: any): err is { http_code: number } => {
    //    return err.name === 'UploadApiError' && typeof err.http_code === 'number';
    //};
    

    //if(isCloudinaryError(err)){

    if (err.name === 'UploadApiError' || err.http_code) {
        res.status(err.http_code as number).json({                                      // as number einfach aber
        code: err.http_code as number < 500 ? 'ValidationError' : 'CloudinaryError',
            message: err.message,
        });
        return 
    }
    // Logge den Error
    logger.error('Error:', err.message);

    // Einfache Error Response
    res.status(500).json({
        code: 'ServerError',
        message: 'Something went wrong',
        error: err,
        source: 'server'

    });
};