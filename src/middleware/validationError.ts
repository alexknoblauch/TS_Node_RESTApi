/**
 * Node Modules
 */
import { validationResult } from "express-validator";


/**
 * Types
 */

import type { Request, Response, NextFunction } from 'express'


const validationErrorMiddelware = function(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req)

    if(!errors.isEmpty()){                        //validationResult ist immer ein OBJ, aber leer wenn keine fehler
        res.status(400).json({
            code: 'ValidationError',
            errors: errors.mapped()
        }) 
        return
    }
    next()
}

export default validationErrorMiddelware