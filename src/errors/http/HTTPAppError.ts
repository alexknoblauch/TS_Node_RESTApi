class HttpAppError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly status: string
  readonly isOperational: boolean
  readonly action?: string
  readonly reason?: string

  constructor(message: string, statusCode: number, code:string, action?: string, reason?: string) {
    super(message);
    
    this.statusCode = statusCode;
    this.code = code
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
    this.isOperational = true;
    this.action = action
    this.reason = reason
    
    
    Error.captureStackTrace(this, this.constructor);
  
    Object.setPrototypeOf(this, new.target.prototype);

  }
}

export default HttpAppError;