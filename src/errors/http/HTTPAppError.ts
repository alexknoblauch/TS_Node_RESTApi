class HttpAppError extends Error {
  statusCode: number
  status: string
  isOperational: boolean
  errorCode: string
  action?: string
  reason?: string

  constructor(message: string, statusCode: number, errorCode:string, action?: string, reason?: string) {
    super(message);
    
    this.statusCode = statusCode;
    this.errorCode = errorCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
    this.isOperational = true;
    this.action = action
    this.reason = reason
    
    
    Error.captureStackTrace(this, this.constructor);
  
    Object.setPrototypeOf(this, new.target.prototype);

  }
}

export default HttpAppError;