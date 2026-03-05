class InfrastructureError extends AppError {
    public service: string     //z.b. 'Redis'
    public cause?: unknown     // catch(err) -> err

    constructor(message: string, service: string, context: Record<string, unknown> = {}, cause?: unknown) {
        super(message, 'INFRASTRUCTURE_ERROR', true, {...context, service, cause});

        this.service = service
        this.cause = cause; 
    }
}