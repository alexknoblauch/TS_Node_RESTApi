class AppError extends Error {
    readonly code: string
    readonly isOperational: boolean
    readonly context: Record<string, any>

    constructor(message: string, code: string, isOperational:boolean = true, context: Record<string, any> = {}){
        super(message)

        this.name = this.constructor.name   
        this.code = code
        this.isOperational = isOperational
        this.context = context

        Error.captureStackTrace(this, this.constructor)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}