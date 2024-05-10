import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
    req.user = user
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Failed to authenticate token' })
  }
}

export default authMiddleware
