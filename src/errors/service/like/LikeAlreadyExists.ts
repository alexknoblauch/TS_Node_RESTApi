import AppError from "../AppError";

class LikeAlreadyExists extends AppError {
    constructor(message = 'Like already exists'){
        super(message, 409, 'LIKE_ALREADY_EXISTS')
    }
}

export default LikeAlreadyExists