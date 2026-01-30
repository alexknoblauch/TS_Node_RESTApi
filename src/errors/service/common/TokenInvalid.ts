import AppError from "../ServiceAppError";

class TokenInvalid extends AppError{
    constructor(message = 'Invalid Token'){
        super(message, 401, 'TOKEN_INVALID')
    }
}

export default TokenInvalid