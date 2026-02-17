import ServiceAppError from "../ServiceAppError";

class CommentNoText extends ServiceAppError {
    constructor(){
        super('No Text found', 'NO_TEXT')
    }
}

export default CommentNoText