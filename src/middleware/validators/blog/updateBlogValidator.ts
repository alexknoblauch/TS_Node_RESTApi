/**
 * Node Modules
 */
import { body } from "express-validator"

/**
 *  Types
 */
import { ValidationChain } from 'express-validator';


const updateBlogValidation = function():ValidationChain[]{
    return [
        body('userId')
        .isMongoId()
        .withMessage('ID is in the wron format.'),
        body('content'),
        body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be one of the value, draft/published')
        ]
}

export default updateBlogValidation