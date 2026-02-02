class ServiceAppError extends Error {
  code: string
  context: Record<string, unknown> = {}

  constructor(message: string, code: string, context: Record<string, unknown> = {}){
    super(message)
    
    this.name = 'ServiceAppError'
    this.code = code
    this.context = context

    Error.captureStackTrace(this, this.constructor)

    Object.setPrototypeOf(this, new.target.prototype);        //extends Error Prolem fix

  }
}

export default ServiceAppError