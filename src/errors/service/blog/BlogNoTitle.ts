import ServiceAppError from "../ServiceAppError";

class BlogNoTitle extends ServiceAppError {
    constructor() {
        super('No title for Blog', 'BLOG_TITLE_ERROR')
    }
}
export default BlogNoTitle