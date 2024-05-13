import express from 'express'
import {
  startParkingSession,
  deleteParkingSession,
  getAllParkingSessions
} from '../controllers/parkingSessionController'
import authMiddleware from '../middleware/auth' 

const parkingSessionRouter = express.Router()

// Start a parking session
parkingSessionRouter.post('/:parkingID/start', [authMiddleware], startParkingSession)

// Delete a parking session
parkingSessionRouter.delete('/:sessionId', [authMiddleware], deleteParkingSession)

// Get all parking sessions
parkingSessionRouter.get('/', [authMiddleware], getAllParkingSessions)

export default parkingSessionRouter

