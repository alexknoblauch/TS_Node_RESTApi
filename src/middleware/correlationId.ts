/**
 * Node Modules
 */
import { v4 as uuidv4 } from 'uuid';
/**
 * Custom Mddules
 */
import { asyncLocalStorageInstance } from '../utils/context/correlationStore'; 
/**
 * Types
 */
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    correlationId?: string;
  }
}

export const correlationIdMiddleware = ( req: Request, res: Response, next: NextFunction ) => {
  const correlationId = uuidv4();

  asyncLocalStorageInstance.run(correlationId, () => {
    next(); 
  });
};
