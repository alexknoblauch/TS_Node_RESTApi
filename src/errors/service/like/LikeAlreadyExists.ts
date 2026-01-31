import ServiceAppError from "../ServiceAppError";

class LikeAlreadyExists extends ServiceAppError {
    constructor(){
        super('Like already exists', 'LIKE_EXISTS')
    }
}

export default LikeAlreadyExists