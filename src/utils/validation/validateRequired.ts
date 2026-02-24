// utils/validateRequired.ts
import logger from '@/lib/winston'
import { Request } from 'express'
import { badRequest } from '@/errors/http/badRequestError'


            // T weil req Object express sher komplex
export function validateRequired<T>(req: Request, value: any, name: string): asserts value is NonNullable <T> {                 // so ist wert nie undefined   T weil req Objeckt sehr komplex
    if (!value) {
        logger.error(`${name} is required`)
        
        throw badRequest(req, `${name} is required`)
    }
}