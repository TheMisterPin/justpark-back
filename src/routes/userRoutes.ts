import authMiddleware from '../middleware/auth'
import { addCredit, currentUser, deleteUser, updateUser, checkCredit } from '../controllers/userController'
import express from 'express'
import carRouter from './carRoutes'

const router = express.Router()

router.get('/me',[authMiddleware], currentUser)
router.delete('/:userID', [authMiddleware], deleteUser)
router.put('/:userID',[authMiddleware], updateUser )
router.put('/credit/:userID',[authMiddleware], addCredit )
router.get('/credit/:userID',[authMiddleware], checkCredit )
router.use('/cars', [authMiddleware], carRouter)

export default router
