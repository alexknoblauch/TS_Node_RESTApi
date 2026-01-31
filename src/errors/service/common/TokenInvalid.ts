import ServiceAppError from "../ServiceAppError";

class TokenInvalid extends ServiceAppError {
    constructor(){
        super('Invalid Token', 'INVALID_TOKEN')
    }
}

export default TokenInvalid