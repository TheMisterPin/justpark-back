import express from 'express'
import {
  getAllWardens,
  getParkingWardens,
  addWarden,
  updateWarden,
  deleteWarden
} from '../controllers/wardenController'

const router = express.Router()


router.get('/wardens', getAllWardens)


router.get('/wardens/parking/:parkingID', getParkingWardens)


router.post('/wardens/parking/:parkingID', addWarden)


router.put('/wardens/:wardenId', updateWarden)


router.delete('/wardens/:wardenId', deleteWarden)

export default router
