import ServiceAppError from "../ServiceAppError";

class LikeAlreadyExists extends ServiceAppError {
    constructor(context: Record<string, any> = {}){
        super('Like already exists', 'LIKE_EXISTS', context)
    }
}

export default LikeAlreadyExists