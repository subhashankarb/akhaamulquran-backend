// src/routes/auth.routes.ts
import { Router } from 'express'
import { register, login, verifyOtp, resendOtp, getProfile } from '../controllers/auth.controller'
import { authGuard } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.get('/me', authGuard, getProfile)

export default router
