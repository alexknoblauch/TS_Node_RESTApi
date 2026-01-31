import ServiceAppError from "../ServiceAppError";

class LikeNotFound extends ServiceAppError {
    constructor(){
        super('Like not found', 'LIKE_NOT_FOUND')
    }
}

export default LikeNotFound