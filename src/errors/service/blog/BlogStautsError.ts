import ServiceAppError from "../ServiceAppError";

class BlogStatusError extends ServiceAppError {
    constructor(context: Record<string, any> = {}){
        super('Blog Status not corret', 'BLOG_STATUS_ERROR', context)
    }
}

export default BlogStatusError