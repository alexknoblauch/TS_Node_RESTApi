declare global {
  namespace Express {
    interface Request {                 
      userId?: string;        // Simple Version
      correlationId?: string;
      user?: IUser;
      userRole?: string
    }
  }
}
export {};