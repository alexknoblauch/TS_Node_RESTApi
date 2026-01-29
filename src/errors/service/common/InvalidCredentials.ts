import AppError from "../AppError";

class InvalidCrednetials extends AppError {
    constructor(message = 'Invalid Login') {
        super(message, 401, 'INVALID_CREDENTIALS');
        this.name = 'InvalidCredentials';
    }
}

export default InvalidCrednetials
