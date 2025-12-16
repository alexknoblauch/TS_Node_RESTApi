declare global {
  namespace Express {
    interface Request {                 
      userId?: string;        // Simple Version
      correlationId?: string;
    }
  }
}
export {};