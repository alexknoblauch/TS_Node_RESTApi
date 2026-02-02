import ServiceAppError from "../ServiceAppError";

type TokenErrorType = 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'REVOKED_TOKEN'

class TokenError extends ServiceAppError {
    constructor(message: string, type: TokenErrorType){
        super(message, type)
    }
}

export default TokenError