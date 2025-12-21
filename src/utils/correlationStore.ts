/*
* Custom Modules
*/
import { AsyncLocalStorage } from 'async_hooks';

declare module 'express' {
  interface Request {
    correlationId?: string;
  }
}

export const asyncLocalStorageInstance = new AsyncLocalStorage<string>();  