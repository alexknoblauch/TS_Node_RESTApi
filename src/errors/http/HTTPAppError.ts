class HttpAppError extends AppError {
  readonly statusCode: number
  readonly status: string
  readonly action?: string
  readonly reason?: string

  constructor(message: string, statusCode: number, code:string, context: Record<string, unknown> = {}, action?: string, reason?: string) {
    super(message, code, true, {...context, reason});
    
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? 'error' : 'fail'
    this.action = action ?? 'REQUEST'
    this.reason = reason ?? code
  }
}

export default HttpAppError;