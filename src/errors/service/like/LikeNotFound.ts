import ServiceAppError from "../ServiceAppError";

class LikeNotFound extends ServiceAppError {
    constructor(context: Record<string, any>){
        super('Like not found', 'LIKE_NOT_FOUND', context)
    }
}

export default LikeNotFound