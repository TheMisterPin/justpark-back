import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function startParkingSession(req: express.Request, res: express.Response) {
  const { parkingID } = req.params
  const { carId } = req.body
  if (!parkingID) {
    res.status(404).json({ message: 'Must give parking ID' })
    return
  }
  try {
    const parkingId = parseInt(parkingID, 10)
    if (isNaN(parkingId)) {
      res.status(400).json({ message: 'Invalid parking ID' })
      return
    }

    const selectedParking = await prisma.parking.findUnique({
      where: { id: parkingId },
      include: { parkedCars: true }
    })

    if (!selectedParking) {
      res.status(404).json({ message: 'Parking not found' })
      return
    }

    if (selectedParking.parkedCars.length >= selectedParking.totalSpaces) {
      res.status(406).json({ message: 'Selected parking is full' })
      return
    }

    await prisma.parkingSession.create({
      data: {
        carId: parseInt(carId, 10),
        parkingId: parkingId
      }
    })

    res.status(201).json({ message: 'Session created successfully!' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to start parking session', error: error.message })
  }
}
async function getAllParkingSessions(req: express.Request, res: express.Response) {
  try {
    const sessions = await prisma.parkingSession.findMany({
      include: {
        car: true, // Include details about the car
        parking: true // Include details about the parking
      }
    })

    res.json(sessions)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve parking sessions', error: error.message })
  }
}

async function deleteParkingSession(req: express.Request, res: express.Response) {
  const { sessionId } = req.params

  try {
    const session = await prisma.parkingSession.findUnique({
      where: { id: parseInt(sessionId, 10) }
    })

    if (!session) {
      res.status(404).json({ message: 'Parking session not found' })
      return
    }



    await prisma.parkingSession.delete({
      where: { id: parseInt(sessionId, 10) }
    })

    res.status(200).json({ message: 'Parking session deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete parking session', error: error.message })
  }
}

export { startParkingSession, deleteParkingSession, getAllParkingSessions}
