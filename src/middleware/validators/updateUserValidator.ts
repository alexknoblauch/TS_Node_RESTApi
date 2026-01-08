import { createUserRepository } from "@/Repositories/userRepository"
import { body } from "express-validator"


const userRepository = createUserRepository()

export const updateUserValidator = function(){
    return [
        body('username')
        .optional()
        .trim()
        .isLength({max: 20})
        .withMessage('Username must be less than 20 chars')
        .custom(async (value) => {
            const userExists = await userRepository.existUsername(value)

            if(userExists){
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
            const emailExists = await userRepository.existsByEmail(value)

            if(emailExists){
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