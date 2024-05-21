import express from 'express'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function isParkingFull(parkingID: number): Promise<boolean> {
  const selectedParking = await prisma.parking.findUnique({
    where: { id: parkingID },
    include: { parkedCars: true }
  })

  if (!selectedParking) {
    return false
  }

  return selectedParking.parkedCars.length >= selectedParking.totalSpaces
}

async function startParkingSession(req: express.Request, res: express.Response) {
  const { parkingID } = req.params
  const { licencePlate, totalHours } = req.body
  const carOwner = req.user

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

    const isFull = await isParkingFull(parkingId)
    if (isFull) {
      res.status(406).json({ message: 'Selected parking is full' })
      return
    }

    const selectedParking = await prisma.parking.findUnique({
      where: { id: parkingId }
    })
    if (!selectedParking) {
      res.status(404).json({ message: 'Parking not found' })
      return
    }

    const car = await prisma.car.findUnique({
      where: { licencePlate: licencePlate }
    })
    if (!car) {
      res.status(404).json({ message: 'Car not found' })
      return
    }

    const endTime = new Date()
    endTime.setHours(endTime.getHours() + totalHours)
    const amount = totalHours * selectedParking.hourlyPrice

    await prisma.$transaction(async prisma => {
      const session = await prisma.parkingSession.create({
        data: {
          carId: car.id,
          parkingId: selectedParking.id,
          startTime: new Date(),
          endTime: endTime,
          amount: amount
        }
      })

      await prisma.car.update({
        where: { id: car.id },
        data: { parkingId: selectedParking.id }
      })

      await prisma.parking.update({
        where: { id: selectedParking.id },
        data: {
          parkedCars: {
            connect: { id: car.id }
          },
          takings: {
            increment: amount
          }
        }
      })

      await prisma.user.update({
        where: { id: carOwner.id },
        data: { credit: { decrement: amount } }
      })

      return session
    })

    res.status(201).json({ message: 'Session created successfully!', endTime: endTime })
  } catch (error) {
    res.status(500).json({ message: 'Failed to start parking session', error: error.message })
  }
}

async function getAllParkingSessions(req: express.Request, res: express.Response) {
  try {
    const sessions = await prisma.parkingSession.findMany({
      include: {
        car: true,
        parking: true 
      }
    })

    res.status(200).json(sessions)
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
