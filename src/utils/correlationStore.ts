/*
* Custom Modules
*/
import { AsyncLocalStorage } from 'async_hooks';

declare module 'express' {
  interface Request {
    correlationId?: string;
  }
}

const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();         //spezieller REQ ASYNC speicher

export const getCorrelationId = (): string | undefined => {
  const store = asyncLocalStorage.getStore();
  return store?.get('correlationId');
};

// Export für Middleware
export const asyncLocalStorageInstance = asyncLocalStorage;