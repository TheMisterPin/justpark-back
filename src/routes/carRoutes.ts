import express from 'express'
import { addCar, updateCar, deleteCar } from '../controllers/carsController'
import authMiddleware from '../middleware/auth'

const carRouter = express.Router()

carRouter.post('/', [authMiddleware], addCar)

carRouter.patch('/:licencePlate', updateCar)

carRouter.delete('/:licencePlate', deleteCar)

export default carRouter
