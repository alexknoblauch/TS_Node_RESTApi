class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  errorCode: string

  constructor(message: string, statusCode: number, errorCode:string) {
    super(message);
    
    this.statusCode = statusCode;
    this.errorCode = errorCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
    this.isOperational = true;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;