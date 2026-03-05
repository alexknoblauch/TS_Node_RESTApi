import ServiceAppError from "../ServiceAppError";

class InsufficientPermissionsError extends ServiceAppError {
    constructor(context: Record<string, any> = {}){
        super('Insufficient Permissions', 'INSUFFICIENT_PERMISSIONS', context)
    }
}

export default InsufficientPermissionsError