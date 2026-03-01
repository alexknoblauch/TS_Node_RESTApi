class ServiceAppError extends AppError {
  constructor(message: string, code: string, isOperational: boolean = true, context: Record<string, unknown> = {}) {
    super(message, code, true, context);
  }
}

export default ServiceAppError;