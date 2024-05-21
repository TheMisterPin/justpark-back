import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()
const jwt_secret = process.env.JWT_SECRET as string

const roleMiddleware = (requiredRole: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: 'Token not found' })
    }

    try {
      const payload = jwt.verify(token, jwt_secret ) as any
      const auth = await prisma.auth.findUnique({
        where: { sessionToken: token },
        include: { user: true }
      })
      if (!auth) {
        return res.status(401).json({ message: 'Session not found' })
      }

      const user = auth.user
      if (user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      req.user = user
      req.role = user.role
      next()
    } catch (error) {
      return res.status(500).json({ message: 'Failed to authenticate token', error: error.message })
    }
  }
}

export default roleMiddleware
