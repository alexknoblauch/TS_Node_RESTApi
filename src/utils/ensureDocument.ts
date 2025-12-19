import logger from "@/lib/winston"
import { AppError } from "@/middleware/errorHandler"

export function ensureDocument<T>(
    document: T | null | undefined,
    entityName: string
): asserts document is T  {                         // so ist wert nie undefined   if(!user) check
    if (!document) {
        logger.error(`${entityName} not found`)
        const error = new Error(`${entityName} not found`) as AppError
        error.statusCode = 404
        error.code = `${entityName}NotFound`
        throw error
    }
}
