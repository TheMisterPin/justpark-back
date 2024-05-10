import authMiddleware from '../middleware/auth'
import { currentUser } from '../controllers/userController'
import express from 'express'

const router = express.Router()

router.get('/me',[authMiddleware], currentUser)


export default router
