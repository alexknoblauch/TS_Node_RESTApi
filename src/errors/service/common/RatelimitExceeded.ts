import ServiceAppError from "../ServiceAppError";

class RatelimitExceeded extends ServiceAppError {
    constructor(){
        super('Too many tries', 'RATELIMIT_EXCEEDED')
    }
}

export default RatelimitExceeded