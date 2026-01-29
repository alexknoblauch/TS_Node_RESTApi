import AppError from "../AppError";

class LikeNotFound extends AppError {
    constructor(message = 'Like not found'){
        super(message, 404, 'LIKE_NOT_FOUND')

    }
}

export default LikeNotFound