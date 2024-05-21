import authMiddleware from '../middleware/auth';
import { login, register, logout, resetPassword, lostPassword } from '../controllers/authController';
import express from 'express';

const router = express.Router()

router.post('/signup', register)
router.post('/login', login)
router.post('/logout',[authMiddleware], logout)
router.post('/lostpassword/', lostPassword)
router.post('/reset-password/:token', resetPassword)


export default router