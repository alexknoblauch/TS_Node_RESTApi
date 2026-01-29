import AppError from "@/errors/service/AppError";
import logger from "@/lib/winston";
import { Request, Response, NextFunction } from 'express'


function isAppError(err: unknown): err is AppError {      //APP 
  return err instanceof AppError;
}


export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  
  if (process.env.NODE_ENV === 'production') {
    if (isAppError(err) && err.isOperational) {
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
      return res.status(500).json({
        message: 'Unknown error',
      });
  }
  
  return res.status(500).json({ message: 'Internal server error' });
};