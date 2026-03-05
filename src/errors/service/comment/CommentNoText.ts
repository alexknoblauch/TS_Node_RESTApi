import ServiceAppError from "../ServiceAppError";

class CommentNoText extends ServiceAppError {
    constructor(context: Record<string, any>){
        super('No Text found', 'NO_TEXT', context)
    }
}

export default CommentNoText