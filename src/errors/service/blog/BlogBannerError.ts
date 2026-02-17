import ServiceAppError from "../ServiceAppError";

class BlogBannerError extends ServiceAppError {
    constructor() {
        super('Banner nor correct', 'BANNER_ERROR')
    }
}

export default  BlogBannerError