import { param, ValidationChain } from "express-validator"

const validateGetCommentsByBlog = function():ValidationChain[]{
    return [
    param('blogId')
    .isMongoId()
    .withMessage('ID wrong format')
    ]
}

export default validateGetCommentsByBlog