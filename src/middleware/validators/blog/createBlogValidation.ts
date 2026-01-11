/**
 * Node Modules
 */
import { body } from "express-validator"

/**
 * Types
 */
import { ValidationChain } from 'express-validator';


const createBlogValidation = function():ValidationChain[]{
    return [
        body('title')
        .trim()
        .notEmpty()
        .withMessage('Title must have a value')
        .isLength({max: 100})
        .withMessage('Title must be less then 100'),
        body('content')
        .trim()
        .notEmpty()
        .withMessage('Body must have a value'),
        body('status')
        .optional()
        .isIn(['draf', 'published'])
        .withMessage('Status must be of the value draft or published'),
    ]
}

export default createBlogValidation