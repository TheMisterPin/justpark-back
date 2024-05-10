import parkingRoutes from './parkingRoutes'
import wardenRoutes from './wardenRoutes'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import express from 'express'

const router = express.Router()

router.use('/parkings', parkingRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/wardens', wardenRoutes)

export default router
