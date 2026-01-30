class ServiceAppError extends Error {
  code: string
  context: Record<string, unknown> = {}

  constructor(message: string, code: string, context: Record<string, unknown> = {}){
    super(message)
    
    this.name = 'ServiceAppError'
    this.code = code
    this.context = context

    Error.captureStackTrace(this, this.constructor)
  }
}

export default ServiceAppError