import HttpAppError from "@/errors/http/HTTPAppError";
import logger from "@/lib/winston"

export function ensureDocument<T> (document: T | null | undefined, entityName: string): asserts document is T  {                         // so ist wert nie undefined   if(!user) check
    if (!document) {
        logger.info(`${entityName} not found`, {
            reason: `${entityName.toUpperCase()}._NOT_FOUND`,   
            action: 'FETCH_ATTEMPT'
        })
        throw new HttpAppError(`${entityName} not found`, 401, 'NotFound'); 
    }
}
