import { cookie, ValidationChain } from "express-validator";

const validateAuthRefreshToken =function():ValidationChain[] {
    return [
        cookie('refreshToken')
            .notEmpty()
            .withMessage('Token is empty')
            .isJWT()
            .withMessage('Invalid Token')
    ]
}

export default validateAuthRefreshToken