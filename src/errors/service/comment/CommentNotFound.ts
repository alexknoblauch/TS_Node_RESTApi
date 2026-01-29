import AppError from "../AppError";

class CommentNotFound extends AppError {
    constructor(message = 'Comment not found'){
        super(message, 404, 'COMMENT_NOT_FOUND')

    }
}

export default CommentNotFound