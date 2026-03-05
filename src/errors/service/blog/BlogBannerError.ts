import ServiceAppError from "../ServiceAppError";

class BlogBannerError extends ServiceAppError {
    constructor(context: Record<string, any> = {}) {
        super('Banner nor correct', 'BANNER_ERROR', context)
    }
}

export default  BlogBannerError