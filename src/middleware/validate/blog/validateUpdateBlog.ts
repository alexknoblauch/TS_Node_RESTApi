import { body, ValidationChain } from "express-validator"

const updateUpdateBlog = function():ValidationChain[] {
    return [
        body('userId')
            .isMongoId()
            .withMessage('ID is in the wrong format.'),
            body('content'),
            body('status')
            .optional()
            .isIn(['draft', 'published'])
            .withMessage('Status must be one of the value, draft/published')
    ]
}

export default updateUpdateBlog