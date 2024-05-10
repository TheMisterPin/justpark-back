import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

async function addCar(req: express.Request, res: express.Response): Promise<void> {
  const owner = req.user
  const { licencePlate } = req.body

  if (!owner) {
    res.status(403).json({ message: 'Must be logged in to register a car' })
    return
  }

  try {
    const carExists = await prisma.car.findUnique({
      where: { licencePlate }
    })

    if (carExists) {
      res.status(409).json({ message: 'Licence plate already in use' })
      return
    }

    await prisma.car.create({
      data: {
        licencePlate,
        owner: {
          connect: {
            id: owner.id
          }
        }
      }
    })

    res.status(201).json({ message: 'Car created!' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create car', error: error.message })
  }
}

async function updateCar(req: express.Request, res: express.Response): Promise<void> {
  const { licencePlate } = req.params
  const { newLicence } = req.body
  const owner = req.user

  if (!owner) {
    res.status(403).json({ message: 'Must be logged in to modify a car' })
    return
  }

  try {
    const car = await prisma.car.findUnique({
      where: { licencePlate }
    })

    if (!car) {
      res.status(404).json({ message: 'Wrong licence Plate' })
      return
    }

    if (car.userId != owner.id){
          res.status(403).json({ message: 'Not your car!' })
          return
    }

    await prisma.car.update({
      where: { licencePlate },
      data: { licencePlate: newLicence }
    })

    res.status(200).json({ message: `Licence plate updated to: ${newLicence}` })
  } catch (error) {
    res.status(500).json({ message: 'Failed to modify car', error: error.message })
  }
}

async function deleteCar(req: express.Request, res: express.Response): Promise<void> {
  const { licencePlate } = req.params
  const owner = req.user

  if (!owner) {
    res.status(403).json({ message: 'Must be logged in to delete a car' })
    return
  }

  try {
    const car = await prisma.car.findUnique({
      where: { licencePlate }
    })

    if (!car) {
      res.status(404).json({ message: 'Car not found' })
      return
    }

    if (car.userId !== owner.id) {
      res.status(403).json({ message: 'You are not authorized to delete this car' })
      return
    }

    await prisma.car.delete({
      where: { licencePlate }
    })

    res.status(200).json({ message: 'Car deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete car', error: error.message })
  }
}

export { addCar, updateCar, deleteCar }
