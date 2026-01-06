/**
 *  Node Modules
**/
import Tokens from 'csrf';
import { NextFunction, Request, Response } from 'express';

const tokens = new Tokens({
  saltLength: 8,       
  secretLength: 18,    
});

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  let secret = req.cookies._csrfSecret;
  
  if (!secret) {
    secret = tokens.secretSync();
    
    res.cookie('_csrfSecret', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
  }


  //backend to frontend  token erstellen
  const token = tokens.create(secret);
  res.locals.csrfToken = token;
  res.setHeader('X-CSRF-Token', token);

  
  //fronent to backend kontrolle token
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const clientToken = req.headers['x-csrf-token'] || req.body._csrf;
    if (!clientToken || !tokens.verify(secret, clientToken)) {
      return res.status(403).json({ error: 'CSRF token invalid' });
    }
  }
  
  next();
};