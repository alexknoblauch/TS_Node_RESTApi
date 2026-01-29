import AppError from "../AppError";

class UserNotFound extends AppError {
    constructor(message = 'User not found'){
        super(message, 404, 'USER_NOT_FOUND')

    }
}

export default UserNotFound