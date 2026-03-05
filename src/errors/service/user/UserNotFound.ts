import ServiceAppError from "../ServiceAppError";

class UserNotFound extends ServiceAppError {
    constructor(context: Record<string, any> = {}){
        super('User not found', 'USER_NOT_FOUND', context)
    }
}

export default UserNotFound