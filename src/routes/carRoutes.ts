import express from 'express'
import { addCar, updateCar, deleteCar } from '../controllers/carsController'

const carRouter = express.Router()

carRouter.post('/', addCar)

carRouter.patch('/:licencePlate', updateCar)

carRouter.delete('/:licencePlate', deleteCar)

export default carRouter
