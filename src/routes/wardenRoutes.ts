import express from 'express'
import {
  getAllWardens,
  getParkingWardens,
  addWarden,
  updateWarden,
  deleteWarden
} from '../controllers/wardenController'

const router = express.Router()

// Retrieve all wardens
router.get('/wardens', getAllWardens)

// Retrieve wardens for a specific parking
router.get('/wardens/parking/:parkingID', getParkingWardens)

// Add a new warden
router.post('/wardens/parking/:parkingID', addWarden)

// Update a warden
router.put('/wardens/:wardenId', updateWarden)

// Delete a warden
router.delete('/wardens/:wardenId', deleteWarden)

export default router
