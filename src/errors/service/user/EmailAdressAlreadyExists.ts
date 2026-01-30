import AppError from "../ServiceAppError";

class EmailAdressAlreadyExists extends AppError{
    constructor(message = 'Email Adress already exists') {
        super(message, 409, 'EMAIL_ALREADY_EXISTS')
    }
}

export default EmailAdressAlreadyExists