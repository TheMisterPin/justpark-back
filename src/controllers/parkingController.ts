import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

async function getAllParkings(req: express.Request, res: express.Response) {
  try {
    const parkings = await prisma.parking.findMany()
    res.json(parkings)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve parkings', error: error.message })
  }
}

async function getParkingById(req: express.Request, res: express.Response) {
  const { parkingID } = req.params
  try {
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID) }
    })
    if (parking) {
      res.json(parking)
    } else {
      res.status(404).json({ message: 'Parking not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve parking', error: error.message })
  }
}

async function createParking(req: express.Request, res: express.Response) {
  const { name, location,totalSpaces } = req.body
  const parkingAdmin = req.user 
  if (!parkingAdmin || !parkingAdmin.id) {
    return res.status(403).json({ message: 'No parking admin specified or incorrect user data' })
  }

  try {
    const parking = await prisma.parking.create({
      data: {
        name,
        location,
        totalSpaces: totalSpaces || 10,
        parkingAdmin: {
          connect: {
            id: parkingAdmin.id
          }
        }
      }
    })
    res.json(parking)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create parking', error: error.message })
  }
}
async function updateParking(req: express.Request, res: express.Response) {
  const { parkingID } = req.params
  const { name, location, totalSpaces } = req.body
  const owner = req.user

  try {
    const existingParking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID) }
    })
    if (!existingParking) {
      return res.status(404).json({ message: 'Parking not found' })
    }
    if (existingParking.parkingAdminId !== owner?.id) {
      return res.status(403).json({ message: 'You are not authorized to update this parking' })
    }

    const updatedParking = await prisma.parking.update({
      where: { id: parseInt(parkingID) },
      data: {
        name: name ?? existingParking.name,
        location: location ?? existingParking.location,
        totalSpaces: totalSpaces ?? existingParking.totalSpaces
      }
    })
    res.json(updatedParking)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update parking', error: error.message })
  }
}

async function deleteParking(req: express.Request, res: express.Response) {
  const { parkingID } = req.params
  const owner = req.user

  try {
    const existingParking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID) }
    })
    if (!existingParking) {
      return res.status(404).json({ message: 'Parking not found' })
    }
    if (existingParking.parkingAdminId !== owner?.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this parking' })
    }

    await prisma.parking.delete({
      where: { id: parseInt(parkingID) }
    })
    res.json({ message: 'Parking deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete parking', error: error.message })
  }
}



export { getAllParkings, getParkingById, createParking, updateParking, deleteParking}
