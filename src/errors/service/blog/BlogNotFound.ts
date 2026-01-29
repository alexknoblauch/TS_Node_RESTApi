import AppError from "../AppError";

class BlogNotFound extends AppError {
    constructor(message = 'Blog not found'){
        super(message, 404, 'BLOG_NOT_FOUND')

    }
}

export default BlogNotFound