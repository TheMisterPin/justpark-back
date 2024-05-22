import { PrismaClient, Role } from '@prisma/client'
import express from 'express'

import getCoordinates from '../utils/location'

const prisma = new PrismaClient()

const getAllParkings = async (req: express.Request, res: express.Response) => {
  const { user } = req
  const { role } = req

  if (role === Role.OWNER) {
    try {
      const parkings = await prisma.parking.findMany({ where: { parkingAdminId: user.id } })

      return res.status(200).json(parkings)
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve parkings', error: error.message })
    }
  }
  try {
    const parkings = await prisma.parking.findMany()

    return res.status(200).json(parkings)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve parkings', error: error.message })
  }
}

const getParkingById = async (req: express.Request, res: express.Response) => {
  const { parkingID } = req.params

  try {
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID, 10) },
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
const createParking = async (req: express.Request, res: express.Response) => {
  const { name, address, totalSpaces } = req.body
  const parkingAdmin = req.user
  const userRole = req.role

  if (!parkingAdmin || !parkingAdmin.id) {
    return res.status(403).json({ message: 'No parking admin specified or incorrect user data' })
  }

  if (!name || !address) {
    return res.status(400).json({ message: 'Missing required fields: name or address' })
  }

  try {
    const location = await getCoordinates(address)

    await prisma.$transaction(async (tx) => {
      const newLocation = await tx.location.create({
        data: {
          latitude: location.lat,
          longitude: location.lng,
        },
      })

      const parking = await tx.parking.create({
        data: {
          name,
          location: {
            connect: {
              id: newLocation.id,
            },
          },
          totalSpaces: totalSpaces || 10,
          parkingAdmin: {
            connect: {
              id: parkingAdmin.id,
            },
          },
        },
      })

      let roleUpdated = false

      if (userRole !== Role.OWNER) {
        await tx.user.update({
          where: { id: parkingAdmin.id },
          data: { role: Role.OWNER },
        })
        roleUpdated = true
      }

      return res.status(200).json({
        parking,
        message: roleUpdated ? 'User role updated to OWNER.' : 'User role unchanged.',
      })
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create parking', error: error.message })
  }
}
const updateParking = async (req: express.Request, res: express.Response) => {
  const { parkingID } = req.params
  const { name, address, totalSpaces } = req.body
  const owner = req.user
  const location = await getCoordinates(address)

  try {
    const existingParking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID, 10) },
    })

    if (!existingParking) {
      return res.status(404).json({ message: 'Parking not found' })
    }
    if (existingParking.parkingAdminId !== owner?.id) {
      return res.status(403).json({ message: 'You are not authorized to update this parking' })
    }

    const updatedParking = await prisma.parking.update({
      where: { id: parseInt(parkingID, 10) },
      data: {
        name: name ?? existingParking.name,
        location: location ?? existingParking.locationId,
        totalSpaces: totalSpaces ?? existingParking.totalSpaces,
      },
    })

    res.json(updatedParking)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update parking', error: error.message })
  }
}

const deleteParking = async (req: express.Request, res: express.Response) => {
  const { parkingID } = req.params
  const owner = req.user

  try {
    const existingParking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID, 10) },
    })

    if (!existingParking) {
      return res.status(404).json({ message: 'Parking not found' })
    }
    if (existingParking.parkingAdminId !== owner?.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this parking' })
    }

    await prisma.parking.delete({
      where: { id: parseInt(parkingID, 10) },
    })
    res.json({ message: 'Parking deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete parking', error: error.message })
  }
}

const checkCars = async (req: express.Request, res: express.Response) => {
  const { parkingID } = req.params

  if (!parkingID) {
    return res.status(404).json({ message: 'Can\'t find parking' })
  }

  try {
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID, 10) },
      select: { parkedCars: true, _count: true },
    })

    if (parking) {
      res.json(parking)
    } else {
      res.status(404).json({ message: 'Parking not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve parking info', error: error.message })
  }
}

export {
  getAllParkings, getParkingById, createParking, updateParking, deleteParking, checkCars,
}
