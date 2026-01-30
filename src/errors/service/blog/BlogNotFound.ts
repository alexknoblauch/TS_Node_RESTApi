import ServiceAppError from "../ServiceAppError";

class BlogNotFound extends ServiceAppError {
    constructor(){
        super('Blog not found', 'BLOG_NOT_FOUND')
    }
}

export default BlogNotFound