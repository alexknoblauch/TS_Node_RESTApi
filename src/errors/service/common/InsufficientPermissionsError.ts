import ServiceAppError from "../ServiceAppError";

class InsufficientPermissionsError extends ServiceAppError {
    constructor(){
        super('Insufficient Permissions', 'INSUFFICIENT_PERMISSIONS')
    }
}