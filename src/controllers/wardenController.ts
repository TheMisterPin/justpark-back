/* eslint-disable max-len */
import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'
import express from 'express'

const prisma = new PrismaClient()

// Get all wardens
async function getAllWardens(req: express.Request, res: express.Response) {
  try {
    const wardenAssignments = await prisma.wardenAssignment.findMany({
      include: { user: true },
    })
    const uniqueUsers = new Map()

    wardenAssignments.forEach((wa) => {
      uniqueUsers.set(wa.userId, wa.user)
    })
    res.json(Array.from(uniqueUsers.values()))
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve all wardens', error: error.message })
  }
}

// Get wardens for a specific parking
async function getParkingWardens(req: express.Request, res: express.Response) {
  const { parkingID } = req.params
  const owner = req.user

  try {
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID, 10) },
      include: { parkingAdmin: true },
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
      where: { parkingId: parseInt(parkingID, 10) },
      include: { user: true },
    })

    res.json(wardens.map((w) => w.user))
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve parking wardens', error: error.message })
  }
}

// Get a warden by ID
async function getWardenById(req: express.Request, res: express.Response) {
  const { wardenId } = req.params

  try {
    const warden = await prisma.user.findUnique({
      where: { id: parseInt(wardenId, 10) },
      include: { WardenAssignment: true },
    })

    if (!warden) {
      res.status(404).json({ message: 'Warden not found' })

      return
    }

    res.json(warden)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve warden', error: error.message })
  }
}

// Add a new warden
async function addWarden(req: express.Request, res: express.Response) {
  const { parkingID } = req.params
  const { name, email, password } = req.body

  try {
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingID, 10) },
      include: { parkingAdmin: true },
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
        role: 'WARDEN',
      },
    })

    await prisma.wardenAssignment.create({
      data: {
        parkingId: parseInt(parkingID, 10),
        userId: newWarden.id,
      },
    })
    res.json({ message: 'Warden added successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to add warden', error: error.message })
  }
}

// Update a warden
async function updateWarden(req: express.Request, res: express.Response) {
  const { wardenId } = req.params
  const { name, email } = req.body
  const owner = req.user

  try {
    const warden = await prisma.user.findUnique({
      where: { id: parseInt(wardenId, 10) },
    })

    if (!warden) {
      res.status(404).json({ message: 'Warden not found' })

      return
    }

    if (owner.role !== 'OWNER') {
      res.status(403).json({ message: 'You are not authorized to update this warden' })

      return
    }

    const updatedWarden = await prisma.user.update({
      where: { id: parseInt(wardenId, 10) },
      data: { name, email },
    })

    res.json({ message: 'Warden updated successfully', warden: updatedWarden })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update warden', error: error.message })
  }
}

// Reassign a warden
async function reassignWarden(req: express.Request, res: express.Response) {
  const { wardenId, newParkingID } = req.params
  const owner = req.user

  try {
    const wardenAssignment = await prisma.wardenAssignment.findUnique({
      where: { parkingId_userId: { userId: parseInt(wardenId, 10), parkingId: parseInt(newParkingID, 10) } },
    })

    if (!wardenAssignment) {
      res.status(404).json({ message: 'Warden assignment not found' })

      return
    }

    const newParking = await prisma.parking.findUnique({
      where: { id: parseInt(newParkingID, 10) },
    })

    if (!newParking) {
      res.status(404).json({ message: 'New parking not found' })

      return
    }

    if (owner.role !== 'OWNER') {
      res.status(403).json({ message: 'You are not authorized to reassign this warden' })

      return
    }

    await prisma.wardenAssignment.update({
      where: {
        parkingId_userId: { userId: parseInt(wardenId, 10), parkingId: wardenAssignment.parkingId },
      },
      data: { parkingId: parseInt(newParkingID, 10) },
    })

    res.json({ message: 'Warden reassigned successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to reassign warden', error: error.message })
  }
}

// Delete a warden
async function deleteWarden(req: express.Request, res: express.Response) {
  const { wardenId } = req.params
  const owner = req.user

  try {
    const warden = await prisma.user.findUnique({
      where: { id: parseInt(wardenId, 10) },
    })

    if (!warden) {
      res.status(404).json({ message: 'Warden not found' })

      return
    }

    if (owner.role !== 'OWNER') {
      res.status(403).json({ message: 'You are not authorized to delete this warden' })

      return
    }

    await prisma.user.delete({
      where: { id: parseInt(wardenId, 10) },
    })

    res.json({ message: 'Warden deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete warden', error: error.message })
  }
}

export {
  getAllWardens,
  getParkingWardens,
  getWardenById,
  addWarden,
  updateWarden,
  reassignWarden,
  deleteWarden,
}
