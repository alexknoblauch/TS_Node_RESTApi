import ServiceAppError from "../ServiceAppError";

class BlogNoContent extends ServiceAppError {
    constructor(context: Record<string, any> = {}){
        super('No Content for Blog defined', 'NO_CONTENT', context)
    }
}

export default BlogNoContent