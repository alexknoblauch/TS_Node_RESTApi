import ServiceAppError from "../ServiceAppError";

class EmailAdressAlreadyExists extends ServiceAppError {
    constructor(context: Record<string, unknown> = {}){
        super('Email already exists', 'EMAIL_ERROR', context)
    }
}