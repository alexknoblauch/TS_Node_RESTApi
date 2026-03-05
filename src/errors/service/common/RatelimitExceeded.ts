import ServiceAppError from "../ServiceAppError";

class RatelimitExceeded extends ServiceAppError {
    constructor(context: Record<string, any>){
        super('Too many tries', 'RATELIMIT_EXCEEDED', context)
    }
}

export default RatelimitExceeded