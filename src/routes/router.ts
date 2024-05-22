import express from 'express'
import parkingRoutes from './parkingRoutes'
import wardenRoutes from './wardenRoutes'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import roleMiddleware from '../middleware/role'
import parkingSessionRouter from './parkingSessionRouter'

const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/parkings', parkingRoutes)
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/wardens', roleMiddleware('WARDEN'), wardenRoutes)
app.use('/session', parkingSessionRouter)

export default app
