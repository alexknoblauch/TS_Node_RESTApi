class InfrastructureError extends Error {
    public service: string     //z.b. 'Redis'
    public cause?: unknown     // catch(err) -> err

    constructor(message: string, service: string, cause?: unknown) {
        super(message);

        this.message = `[${service}] ${message}`
        this.name = 'InfrastructureError';
        this.service = service
        this.cause = cause; 
        Error.captureStackTrace(this, this.constructor)
        Object.setPrototypeOf(this, new.target.prototype)
    }

}