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
    const auth = await prisma.auth.findUnique({
      where: { sessionToken: token },
      include: { user: true }
    })
    if (!auth) {
      return res.status(401).json({ message: 'Session not found' })
    }

    req.user = auth.user
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Failed to authenticate token', error: error.message })
  }
}

export default authMiddleware
