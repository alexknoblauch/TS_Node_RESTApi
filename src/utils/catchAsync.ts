// utils/catchAsync.ts - ÄNDERE DIE DATEIENDUNG zu .ts
import { Request, Response, NextFunction } from 'express';

const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((err: unknown) => {
      if (err instanceof Error) {
        next(err); 
      } else {
        next(new Error(String(err))); 
      }
    });
  };
};

export default catchAsync; 