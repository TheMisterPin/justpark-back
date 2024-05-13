import authMiddleware from '../middleware/auth'
import { currentUser, deleteUser, updateUser } from '../controllers/userController'
import express from 'express'

const router = express.Router()

router.get('/me',[authMiddleware], currentUser)
router.delete('/:userID', [authMiddleware], deleteUser)
router.put('/:userID',[authMiddleware], updateUser )


export default router
