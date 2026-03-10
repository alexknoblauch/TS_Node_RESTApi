import HttpAppError from "@/errors/http/HTTPAppError";
import ServiceAppError from "@/errors/service/ServiceAppError";
import logger from "@/lib/winston";

export function ensureArray<T>(array: T[] | null | undefined, entityName: string): asserts array is NonNullable<T[]> {
  if (!array || array.length === 0) {
    logger.error(`${entityName} array not found or empty`);

    throw new ServiceAppError(`${entityName} not found`, `${entityName}_NOT_FOUND`);
  }
}