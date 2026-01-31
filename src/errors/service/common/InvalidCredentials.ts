import ServiceAppError from "../ServiceAppError";

class InvalidCredentials extends ServiceAppError {
    constructor(){
        super('InvalidCredentials', 'INVALID_CREDENTIALS')
    }
}

export default InvalidCredentials