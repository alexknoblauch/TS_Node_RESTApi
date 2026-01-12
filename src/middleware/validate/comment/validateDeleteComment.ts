import { param, ValidationChain } from "express-validator"

const validateDeleteComment = function():ValidationChain[]{
    return [
        param('commentId')
            .isMongoId()
            .withMessage('ID wrong format')
    ]
}

export default validateDeleteComment