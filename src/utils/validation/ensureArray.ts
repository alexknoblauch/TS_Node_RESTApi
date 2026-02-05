import HttpAppError from "@/errors/http/HTTPAppError";
import logger from "@/lib/winston";

export function ensureArray<T>(array: T[] | null | undefined, entityName: string): asserts array is T[] {
  if (!array || array.length === 0) {
    logger.error(`${entityName} array not found or empty`);

    const message = array == null ? `${entityName} not found` : `${entityName.toLowerCase()} is empty`
    const statusCode = array == null ? 404 : 200

    throw new HttpAppError(message, statusCode, `${entityName}NotFound`);
    }
}