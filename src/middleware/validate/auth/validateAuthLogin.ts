import { IUser } from "@/models/user";
import { userRepository } from "@/repository/userRepository/userRepository";
import { body, ValidationChain } from "express-validator";

const validateAuthLogin = function():ValidationChain[] {
    return [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('emai must have a value')
    .isLength({max: 50})
    .withMessage('Email must have less than 50 chars')
    .isEmail()
    .withMessage('Must be valid Email')
    .custom(async function(value, { req }){            // ACHTUNG req in { } sonst gehts nicht! destructoring! req, location, path, parent, siblings 
        const user = await userRepository.findByEmail(value) as IUser[] | null
            
        if(!user){
            throw new Error('User is not found')
        }
    }), 
    body('password')
    .notEmpty()
    .withMessage('Please fill in your passwort')
    .isLength({min: 8})
    .withMessage('Password must have min 8 character')
    ]
}

export default validateAuthLogin