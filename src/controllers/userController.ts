import { PrismaClient, User } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

async function ownerInfo(user: User): Promise<OwnerInfo> {
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      parkings: {
        select: {
          id: true,
          name: true,
          parkedCars: true // This will get the array to calculate length
        }
      }
    }
  })

  if (!userData) {
    throw new Error('User not found')
  }

  // Format the response to include the number of cars in each parking
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    parkings: userData.parkings.map(parking => ({
      id: parking.id,
      name: parking.name,
      parkedCars: parking.parkedCars.length
    }))
  }
}

async function wardenInfo(user: User): Promise<any> {
  const assignments = await prisma.wardenAssignment.findMany({
    where: { userId: user.id },
    select: {
      parking: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return assignments.map(assignment => ({
    parkingId: assignment.parking.id,
    parkingName: assignment.parking.name
  }))
}

async function customerInfo(user: User): Promise<CustomerInfo> {
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      cars: {
        select: {
          id: true,
          licencePlate: true,
          parkingSessions: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              parking: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!userData) {
    throw new Error('User not found')
  }

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    cars: userData.cars.map(car => ({
      id: car.id,
      licencePlate: car.licencePlate,
      parkingSessions: car.parkingSessions.map(session => ({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        parkingName: session.parking.name
      }))
    }))
  }
}

async function currentUser(req: express.Request, res: express.Response): Promise<void> {
  const user = req.user

  if (!user) {
    res.status(403).json({ message: 'No user logged in' })
    return
  }

  try {
    let responseData

    switch (user.role) {
      case 'OWNER':
        responseData = await ownerInfo(user)
        break
      case 'WARDEN':
        responseData = await wardenInfo(user)
        break
      case 'CUSTOMER':
        responseData = await customerInfo(user)
        break
      default:
        res.status(403).json({ message: 'Invalid user role' })
        return
    }

    res.json(responseData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


async function updateUser(req: express.Request, res: express.Response) {
  const  user = req.user
  const { name, email } = req.body
 

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id}
    })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }


    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ?? user.name,
        email: email ?? existingUser.email,
        
      }
    })
    res.json("user updated")
  } catch (error) {
    res.status(500).json({ message: 'Failed to update parking', error: error.message })
  }
}

async function deleteUser(req: express.Request, res: express.Response) {
  const { userID } = req.params
  const user = req.user

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userID, 10) }
    })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (existingUser.id !== user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this User' })
    }

    await prisma.user.delete({
      where: { id: parseInt(userID, 10) }
    })
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete User', error: error.message })
  }
}
export {currentUser, updateUser, deleteUser}
