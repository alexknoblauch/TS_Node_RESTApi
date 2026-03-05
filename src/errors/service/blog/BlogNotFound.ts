import ServiceAppError from "../ServiceAppError";

class BlogNotFound extends ServiceAppError {
    constructor(context: Record<string, any> = {}){
        super('Blog not found', 'BLOG_NOT_FOUND', context)
    }
}

export default BlogNotFound