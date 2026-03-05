class ServiceAppError extends AppError {
  constructor(message: string, code: string, context: Record<string, unknown> = {}) {
    super(message, code, true, context);
  }
}

export default ServiceAppError;