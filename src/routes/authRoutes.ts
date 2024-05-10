import { login, register } from '../controllers/authController';
import express from 'express';

const router = express.Router()

router.post('/signup', register)
router.post('/login', login)


export default router