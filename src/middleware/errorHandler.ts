import AppError from "@/errors/service/AppError";
import logger from "@/lib/winston";
import { Request, Response, NextFunction } from 'express'


function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}


export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      raw: err
    });
  }

  if (isAppError(err) && err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorCode: err.errorCode
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
    errorCode: 'INTERNAL_SERVER_ERROR'
  });
};
