import ServiceAppError from "../ServiceAppError";

class CommentNotFound extends ServiceAppError{
    constructor(context: Record<string, any> = {}){
        super('Comment not found', 'COMMENT_NOT_FOUND', context)
    }
}

export default CommentNotFound