import { param, ValidationChain } from "express-validator";

const validateDeleteUserById = function():ValidationChain[] {
    return [
        param('userId')
        .notEmpty().isMongoId().withMessage('ID mus be a Mongo UserId')
    ]
}

export default validateDeleteUserById