// utils/validateRequired.ts
import logger from '@/lib/winston'
import { Request } from 'express'
import { badRequest } from '@/errors/http/badRequestError'

export function validateRequired<T>(        // T weil req Object express sher komplex
    req: Request,
    value: any, 
    name: string, 
): asserts value is NonNullable <T> {                 // so ist wert nie undefined   T weil req Objeckt sehr komplex
    if (!value) {
        logger.error(`${name} is required`)
        const error = badRequest(req, `${name} is required`)
        throw error;
    }
}


/* STATIC VERSION ohne req / http abstraktion

// utils/validateRequired.ts
import { AppError } from '@/middleware/errorHandler'
import logger from '@/lib/winston'

export function validateRequired(
    value: any, 
    name: string, 
    statusCode: number = 400,
    customMessage?: string
): asserts value is NonNullable <typeof value> {                 // so ist wert nie undefined   if(!user) check
    if (!value) {
        const message = customMessage || `${name} is required`
        logger.error(message)
        const error = new Error(message) as AppError;
        error.statusCode = statusCode;
        error.code = `${name}Required`;
        throw error;
    }
}
*/