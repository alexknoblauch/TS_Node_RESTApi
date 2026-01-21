import { body, param, ValidationChain } from "express-validator"

const validateCreateComment = function():ValidationChain[] {
    return [
        param('blogId')
            .isMongoId()
            .withMessage('ID wrong format'),
            body('content')
            .isEmpty()
            .withMessage('content must have value')
    ]
}

export default validateCreateComment