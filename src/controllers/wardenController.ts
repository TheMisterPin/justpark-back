import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'
import express from 'express'

const prisma = new PrismaClient()

async function getAllWardens(req: express.Request, res: express.Response) {
  try {
    const wardenAssignments = await prisma.wardenAssignment.findMany({
      include: { user: true }
    })
    const uniqueUsers = new Map()
    wardenAssignments.forEach(wa => {
      uniqueUsers.set(wa.userId, wa.user)
    })
    res.json(Array.from(uniqueUsers.values()))
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve all wardens', error: error.message })
  }
}

async function getParkingWardens(req: express.Request, res: express.Response): Promise<void> {
  const { parkingID } = req.params
  const owner = req.user

  try {
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID) },
      include: { parkingAdmin: true }
    })

    if (!parking) {
      res.status(404).json({ message: 'Parking not found' })
      return
    }

    if (parking.parkingAdminId !== owner?.id) {
      res.status(403).json({ message: 'You are not authorized to view wardens for this parking' })
      return
    }

    const wardens = await prisma.wardenAssignment.findMany({
      where: { parkingId: parseInt(parkingID) },
      include: { user: true }
    })

    res.json(wardens.map(w => w.user))
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve parking wardens', error: error.message })
  }
}

async function addWarden(req: express.Request, res: express.Response) {
  const { parkingID } = req.params
  const { name, email, password } = req.body

  try {
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID) },
      include: { parkingAdmin: true }
    })

    if (!parking) {
      res.status(404).json({ message: 'Parking not found' })
      return
    }

    const newWarden = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
        role: 'WARDEN'
      }
    })
    await prisma.wardenAssignment.create({
      data: {
        parkingId: parseInt(parkingID),
        userId: newWarden.id
      }
    })
    res.json({ message: 'Warden added successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to add warden', error: error.message })
  }
}
export { getAllWardens, getParkingWardens, addWarden }
