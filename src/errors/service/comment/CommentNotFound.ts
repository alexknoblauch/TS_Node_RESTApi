import ServiceAppError from "../ServiceAppError";

class CommentNotFound extends ServiceAppError{
    constructor(){
        super('Comment not found', 'COMMENT_NOT_FOUND')
    }
}

export default CommentNotFound