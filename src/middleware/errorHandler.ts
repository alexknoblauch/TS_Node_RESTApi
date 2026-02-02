import HttpAppError from "@/errors/http/HTTPAppError";
import logger from "@/lib/winston";
import { Request, Response, NextFunction } from 'express'


function isHtttpAppError(err: unknown): err is HttpAppError {      //APP 
  return err instanceof HttpAppError;
}


export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    if (isHtttpAppError(err) && err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        errorCode: err.errorCode
      });
    }

    logger.error('Non-operational error in production:', err);

    return res.status(500).json({
      message: 'Something went wrong',
      errorCode: 'SERVER_ERROR'
    });
    
  } else if (process.env.NODE_ENV === 'development') {
      if (isHtttpAppError(err)) {
          return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
          errorCode: err.errorCode,
          stack: err.stack
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'unknwn error',
          stack: err instanceof Error ? err.stack : undefined         // wichtige TS definition 
        })
      }
  }
};