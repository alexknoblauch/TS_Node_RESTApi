import HttpAppError from "@/errors/http/HTTPAppError";
import ServiceAppError from "@/errors/service/ServiceAppError";
import logger from "@/lib/winston";
import { Request, Response, NextFunction } from 'express'
import { ZodError } from "zod"


function isHttpAppError(err: unknown): err is HttpAppError {      //APP 
  return err instanceof HttpAppError;
}
function isServiceAppError(err: unknown): err is ServiceAppError {      //APP 
  return err instanceof ServiceAppError;
}


export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const isDev = process.env.NODE_ENV === 'development';

  logger.error('Error caught:', { 
    error: err,
    url: req.url,
    method: req.method,
    ip: req.ip 
  });

  
  if (err instanceof ZodError) {
    err = new HttpAppError(
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      {err}
    );
  }

  
  if (isHttpAppError(err)) {
    return res.status(err.statusCode).json({
      message: err.message,
      status: err.status,
      code: err.code,
      ...(isDev && {stack: err.stack})
    });
  }


  if(isServiceAppError(err)) {
    return res.status(400).json({
      message: err.message,
      code: err.code,
      ...(isDev && {stack: err.stack})
    });
  }


  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Something went wrong',
      code: 'SERVER_ERROR',
      ...(isDev && { stack: err.stack })
    });
  }


  return res.status(500).json({
    message: 'Something went wrong',
    errorCode: 'SERVER_ERROR'
  })
}
