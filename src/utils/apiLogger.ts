// src/utils/apiLogger.ts
import { Request, Response, NextFunction } from 'express'

const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  res.on('finish', () => {
    const time = Date.now() - start
    console.log(
      `[API] ${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms`
    )
  })

  next()
}

export default apiLogger
