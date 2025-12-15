import { Types } from 'mongoose'

declare global {
  namespace Express {
    interface Request {                 // damit req.userId in Request aufgenommen wird
      userId?: Types.ObjectId;   
    }
  }
}

export {}