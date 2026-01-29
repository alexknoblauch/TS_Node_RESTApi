import { Request, Response, NextFunction } from 'express';

const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)               // Promise.resolve() defensive pattern gegen sync funtions = crash!
  };
};

export default catchAsync; 