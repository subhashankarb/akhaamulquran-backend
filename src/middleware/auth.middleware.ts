// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  user?: any
}

export const authGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
