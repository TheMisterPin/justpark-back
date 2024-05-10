import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

async function currentUser (req: express.Request, res: express.Response): Promise<void>  {
  if (!req.user) {
    res.status(403).json({ message: 'No user logged in' })
    return
  }
  res.json(req.user)
}

export {currentUser}
