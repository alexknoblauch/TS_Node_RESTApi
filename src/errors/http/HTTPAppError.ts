class HttpAppError extends AppError {
  readonly statusCode: number
  readonly status: string
  readonly action?: string
  readonly reason?: string

  constructor(message: string, statusCode: number, code:string, action?: string, reason?: string) {
    super(message, code, true);
    
    this.name = 'HTTPAppError'
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? 'error' : 'fail'
    this.action = action ?? 'REQUEST'
    this.reason = reason ?? code
  }
}

export default HttpAppError;