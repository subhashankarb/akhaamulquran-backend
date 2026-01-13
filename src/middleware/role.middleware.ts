// src/middleware/role.middleware.ts
import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'

export const requireRole = (roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) =>
    roles.includes(req.user.role)
      ? next()
      : res.status(403).json({ message: 'Forbidden' })
