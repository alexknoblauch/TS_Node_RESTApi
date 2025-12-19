import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";

export function ensureArray<T>(
  array: T[] | null | undefined,
  entityName: string
): asserts array is T[] {
  if (!array || array.length === 0) {
    logger.error(`${entityName} array not found or empty`);
    
    const error = new Error(
      array === null || array === undefined 
        ? `${entityName} not found`
        : `No ${entityName.toLowerCase()} found`
    ) as AppError;
    
    error.statusCode = 404;
    error.code = `${entityName}NotFound`;
    throw error;
  }
}