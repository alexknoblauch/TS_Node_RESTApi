/**
 * Node Modules
 */
import { v4 as uuidv4 } from 'uuid';
/**
 * Custom Mddules
 */
import { asyncLocalStorageInstance } from '../utils/correlationStore'; 
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
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  // WICHTIG: AsyncLocalStorage Context erstellen spezieller speicher für REQ und ASYNC kontext
  const store = new Map();
  store.set('correlationId', correlationId);

  asyncLocalStorageInstance.run(store, () => {
    next(); 
  });
};