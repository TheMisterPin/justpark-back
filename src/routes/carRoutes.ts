import express from 'express'
import { addCar, updateCar, deleteCar } from '../controllers/carsController'
import authMiddleware from '../middleware/auth'

const carRouter = express.Router()

carRouter.post('/', [authMiddleware], addCar)

carRouter.patch('/:licencePlate', [authMiddleware], updateCar)

carRouter.delete('/:licencePlate', [authMiddleware], deleteCar)

export default carRouter
