import AppError from "../AppError";

class RatelimitExceeded extends AppError {
    constructor (message = 'Too many tries') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED')
    }
}

export default RatelimitExceeded