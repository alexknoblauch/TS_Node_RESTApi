import AppError from "../AppError";

class InsufficientPermissionsError extends AppError {
    constructor(message = 'Insufficient Permissions') {
        super(message, 403, 'INSUFFICIENT_PERMISSIONS')
    }
}

export default InsufficientPermissionsError