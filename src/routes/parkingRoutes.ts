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
import roleMiddleware from '../middleware/role';
import { Role } from '@prisma/client';


const router = express.Router()

router.get('/', getAllParkings)
router.get('/:parkingID', getParkingById)
router.post('/', authMiddleware, createParking)
router.put('/:parkingID', authMiddleware, roleMiddleware(Role.OWNER), updateParking)
router.delete('/:parkingID', authMiddleware, roleMiddleware(Role.OWNER), deleteParking)
router.get('/:parkingID/cars', authMiddleware, checkCars)

export default router
