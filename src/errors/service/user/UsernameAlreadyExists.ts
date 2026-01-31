import ServiceAppError from "../ServiceAppError";

class UsernameAlreadyExists extends ServiceAppError {
    constructor(){
        super('Username already exists', 'USERNAME_ALREADY_EXISTS')
    }
}

export default UsernameAlreadyExists