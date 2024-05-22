import express from 'express'
import {
  getAllWardens,
  getParkingWardens,
  getWardenById,
  addWarden,
  updateWarden,
  reassignWarden,
  deleteWarden,
} from '../controllers/wardenController'

const router = express.Router()

router.get('/wardens', getAllWardens)
router.get('/wardens/parking/:parkingID', getParkingWardens)
router.get('/wardens/:wardenId', getWardenById)
router.post('/wardens/parking/:parkingID', addWarden)
router.put('/wardens/:wardenId', updateWarden)
router.put('/wardens/reassign/:wardenId/:newParkingID', reassignWarden)
router.delete('/wardens/:wardenId', deleteWarden)

export default router
