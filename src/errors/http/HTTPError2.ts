import { Request } from "express"

class HTTPError extends Error {
    statusCode: number
    code: string
    status: string
    isOperational: boolean
    options: {
        action?: string
        reason?: string
    }

    constructor(message: string, statusCode: number, code: string, options: {action?: string, reason?: string}){
        super(message)

        this.name = 'HTTPError'
        this.statusCode = statusCode
        this.code = code
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true
        this.options = options

        Error.captureStackTrace(this, this.constructor)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}