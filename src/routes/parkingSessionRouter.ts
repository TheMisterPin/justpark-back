import express from 'express'
import {
  startParkingSession,
  deleteParkingSession,
  getAllParkingSessions,
  updateParkingSession,
} from '../controllers/parkingSessionController'
import authMiddleware from '../middleware/auth'

const parkingSessionRouter = express.Router()

parkingSessionRouter.post('/:parkingID/start', [authMiddleware], startParkingSession)

parkingSessionRouter.delete('/:sessionId', [authMiddleware], deleteParkingSession)

parkingSessionRouter.patch('/:sessionId', updateParkingSession)

parkingSessionRouter.get('/', [authMiddleware], getAllParkingSessions)

export default parkingSessionRouter
