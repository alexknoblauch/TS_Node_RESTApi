class HttpAppError2 extends Error {
    statusCode: number
    code: string


    constructor(message: string, statusCode: number, code: string, action: string, reason: string){
        super(message)

        this.name = 'HttpAppError'
        this.statusCode = statusCode
        this.code = code


        Error.captureStackTrace(this, this.constructor)
    }
}

export default HttpAppError2