import ServiceAppError from "../ServiceAppError";

class InvalidCredentials extends ServiceAppError {
    constructor(context: Record<string, any>){
        super('InvalidCredentials', 'INVALID_CREDENTIALS', context)
    }
}

export default InvalidCredentials