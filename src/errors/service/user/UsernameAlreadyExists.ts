import AppError from "../AppError"

class UsernameAlreadyExists extends AppError {
    constructor(message: 'Username already exists'){
        super(message, 409, 'USERNAME_ALREADY_EXISTS')
    }
}

export default UsernameAlreadyExists