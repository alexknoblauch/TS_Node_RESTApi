import ServiceAppError from "../ServiceAppError";

class UsernameAlreadyExists extends ServiceAppError {
    constructor(context: Record<string, any> = {}){
        super('Username already exists', 'USERNAME_ALREADY_EXISTS', context)
    }
}

export default UsernameAlreadyExists