import parkingRoutes from './parkingRoutes'
import wardenRoutes from './wardenRoutes'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import parkingSessionRouter from './parkingSessionRouter'
import express from 'express'

const router = express.Router()

router.use('/parkings', parkingRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/wardens', wardenRoutes)
router.use('/session', parkingSessionRouter)
router.get('/', (req, res) => {
  res.status(200).json({ message: 'JustPark backend api' })
})

export default router
