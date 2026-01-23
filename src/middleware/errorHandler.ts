// src/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '@/lib/winston';
import {TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'

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
    });
};