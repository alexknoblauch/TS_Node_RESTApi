import ServiceAppError from "../ServiceAppError";

class EmailAlreadyExists extends ServiceAppError {
    constructor(){
        super('Email already exists', 'EMAIL_ALREADY_EXISTS')
    }
}

export default EmailAlreadyExists