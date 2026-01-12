import { userRepository } from "@/repository/userRepository"
import { body, ValidationChain } from "express-validator"

const validateCurrentUser = function():ValidationChain[] {
    return [
        body('username')
        .optional()
        .trim()
        .isLength({max: 20})
        .withMessage('Username must be less than 20 chars')
        .custom(async (value) => {
            const userExists = await userRepository.find({username: value})

            if(userExists.length > 0){                                      // find() array, SPZIEAL CHECK !!
                throw new Error('User already exists!')
            }
        }),
        body('email')
        .optional()
        .isLength({max: 50})
        .withMessage('Email must be shorter than 50 Characters')
        .isEmail()
        .withMessage('Must be valid Email Adress')
        .custom(async(value) => {
            const emailExists = await userRepository.find({email: value})

            if(emailExists.length > 0){                                      // find() array, SPZIEAL CHECK !!
                throw new Error('Email is already in use')
            }
        }),
        body('password')
        .optional()
        .isLength({min: 8})
        .withMessage('Password min 8 Characters')
        ,body('firstName')
        .optional()
        .isLength({max: 30})
        .withMessage('Firstname max 30 Characters'),
        body(['website', 'facebook', 'instagram', 'x', 'linkedin'])
        .optional()
        .isURL()
        .withMessage('Formate must be an URL')
        .isLength({max: 100})
        .withMessage('Characters not allowed succeed 100 chars') 
    ]
}

export default validateCurrentUser