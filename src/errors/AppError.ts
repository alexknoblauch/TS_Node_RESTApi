class AppError extends Error {
    statusCode: number
    code: string

    constructor(message: string, statusCode: number, code = 'APP_ERROR') {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.name = 'AppError'
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError