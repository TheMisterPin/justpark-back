import express from 'express'
import {
  getAllParkings,
  getParkingById,
  createParking,
  updateParking,
  deleteParking,
  checkCars
} from '../controllers/parkingController'
import authMiddleware from '../middleware/auth'

const router = express.Router()

router.get('/', getAllParkings)
router.get('/:parkingID', getParkingById)
router.post('/', [authMiddleware], createParking)
router.patch('/:parkingID', [authMiddleware], updateParking)
router.delete('/:parkingID', [authMiddleware], deleteParking)
router.get('/:parkingID/cars', [authMiddleware], checkCars)

export default router
