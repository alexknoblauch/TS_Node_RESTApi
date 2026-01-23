/*
* Custom Modules
*/
import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorageInstance = new AsyncLocalStorage<string>();