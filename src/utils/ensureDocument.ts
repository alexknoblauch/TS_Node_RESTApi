import logger from "@/lib/winston"
import { AppError } from "@/middleware/errorHandler"
import AppError from "./AppError";

export function ensureDocument<T> (document: T | null | undefined, entityName: string): asserts document is T  {                         // so ist wert nie undefined   if(!user) check
    if (!document) {
        logger.info(`${entityName} not found`, {
            reason: `${entityName.toUpperCase()}._NOT_FOUND`,   
            action: 'FETCH_ATTEMPT'
        })
        throw new AppError(`${entityName} not found`, 401, 'NotFound'); 
    }
}
