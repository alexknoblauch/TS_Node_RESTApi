import { param, ValidationChain } from "express-validator";

const validateGetUser = function():ValidationChain[] {
    return [
        param('userId')
        .notEmpty().isMongoId().withMessage('ID mus be a Mongo UserId')
    ]
}

export default validateGetUser