import ServiceAppError from "../ServiceAppError";

class UserNotFound extends ServiceAppError {
    constructor(){
        super('User not found', 'USER_NOT_FOUND')
    }
}

export default UserNotFound