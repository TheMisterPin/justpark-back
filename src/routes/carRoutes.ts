import express from 'express'
import { addCar, updateCar, deleteCar } from '../controllers/carsController'
import authMiddleware from '../middleware/auth'

const carRouter = express.Router()

// Route to add a new car
carRouter.post('/', [authMiddleware], addCar)

// Route to update an existing car
carRouter.patch('/:licencePlate', [authMiddleware], updateCar)

// Route to delete an existing car
carRouter.delete('/:licencePlate', [authMiddleware], deleteCar)

export default carRouter
