import { userRepository } from "@/repository/userRepository/userRepository";
import { body, ValidationChain } from "express-validator";

const validateAuthRegister = function():ValidationChain[] {
    return [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('emai must have a value')
            .isLength({max: 50})
            .withMessage('Email must have less than 50 chars')
            .isEmail()
            .withMessage('Must be valid Email')
            .custom(async function(value){
                const existing = await userRepository.find({'email': value})
                if(existing){
                    throw new Error('Email already is registrated')
                }
            }), 
            body('password')
            .notEmpty()
            .withMessage('Please fill in your passwort')
            .isLength({min: 8})
            .withMessage('Password must have min 8 character'),
            body('role')
            .optional()
            .isString()
            .withMessage('Role must be a string')
            .isIn(['admin', 'user'])
            .withMessage('Role must be or admin or user')
    ]
}

export default validateAuthRegister