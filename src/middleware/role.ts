import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()


// Middleware to check for authentication and role
const roleMiddleware = (requiredRole: User['role']) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: 'Token not found' })
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any
      const user = await prisma.user.findUnique({ where: { id: payload.userID } })
      if (!user) {
        return res.status(401).json({ message: 'User Not Found' })
      }
      req.role = user.role
      if (user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      next()
    } catch (error) {
      return res.status(500).json({ message: 'Failed to authenticate token' })
    }
  }
}

export default roleMiddleware
