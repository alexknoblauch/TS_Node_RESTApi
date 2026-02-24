class HTTPAppError extends Error {
    statusCode: number
    code: string
    status: string
    action?: string
    reason?: string

    constructor(message: string, stausCode: number, code: string, action?: string, reason?: string) {

        super(message)
        
        this.name = 'HttpAppError'
        this.statusCode = stausCode
        this.code = code
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.action = action
        this.reason = reason

        Error.captureStackTrace(this, this.constructor)
        Object.setPrototypeOf(this, new.target.prototype)

    }
}