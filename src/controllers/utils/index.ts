import {
  Parking, PrismaClient, User,
} from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

async function findParkingById(parkingID: string) {
  return prisma.parking.findUnique({
    where: { id: parseInt(parkingID, 10) },
  })
}

async function findUserById(userID: number) {
  return prisma.user.findUnique({
    where: { id: userID },
  })
}

async function findSessionbyID(sessionID: number) {
  return prisma.parkingSession.findUnique({
    where: { id: sessionID },
  })
}

async function checkUserPermission(
  parking: Parking,
  user: User,
  req: express.Request,
  res: express.Response,
  requiredRole: string,
) {
  const userRole = req.role

  if (!parking) {
    res.status(404).json({ message: 'Parking not found' })

    return false
  }
  if (parking.parkingAdminId !== user?.id && userRole !== requiredRole) {
    res.status(403).json({ message: 'You are not authorized to perform this action' })

    return false
  }

  return true
}

export {
  findParkingById, checkUserPermission, findSessionbyID, findUserById,
}
