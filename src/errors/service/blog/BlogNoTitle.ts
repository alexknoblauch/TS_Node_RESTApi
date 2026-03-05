import ServiceAppError from "../ServiceAppError";

class BlogNoTitle extends ServiceAppError {
    constructor(context: Record<string, any> = {}) {
        super('No title for Blog', 'BLOG_TITLE_ERROR', context)
    }
}
export default BlogNoTitle