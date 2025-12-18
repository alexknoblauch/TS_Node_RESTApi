// utils/validateRequired.ts
import { AppError } from '@/middleware/errorHandler'
import logger from '@/lib/winston'

export function validateRequired(
    value: any, 
    name: string, 
    statusCode: number = 400,
    customMessage?: string
): asserts value is NonNullable<typeof value> {                 // so ist wert nie undefined   if(!user) check
    if (!value) {
        const message = customMessage || `${name} is required`
        logger.error(message)
        const error = new Error(message) as AppError;
        error.statusCode = statusCode;
        error.code = `${name}Required`;
        throw error;
    }
}
