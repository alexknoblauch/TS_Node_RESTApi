import ServiceAppError from "../ServiceAppError";

class BlogNoContent extends ServiceAppError {
    constructor(){
        super('No Content for Blog defined', 'NO_CONTENT')
    }
}

export default BlogNoContent