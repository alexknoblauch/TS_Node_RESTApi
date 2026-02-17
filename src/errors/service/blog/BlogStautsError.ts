import ServiceAppError from "../ServiceAppError";

class BlogStatusError extends ServiceAppError {
    constructor(){
        super('Blog Status not corret', 'BLOG_STATUS_ERROR')
    }
}

export default BlogStatusError