import { getAllWardens, getParkingWardens,addWarden } from '../controllers/wardenController'
import express from 'express'

const router = express.Router()

router.get('/:parkingID', getParkingWardens)
router.get('/', getAllWardens)
router.post('/:parkingID', addWarden)

export default router
