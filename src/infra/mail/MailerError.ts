class MailerError extends Error {
    code: string
    isOperational: boolean

    constructor(message = 'Email send failed', code = 'EMAIL_SEND_FAIL') {
        super(message)

        this.name = 'MailerError'
        this.code = code
        this.isOperational = true

        Object.setPrototypeOf(this, MailerError.prototype);
    }
}

export default MailerError