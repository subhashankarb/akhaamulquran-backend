// src/controllers/auth.controller.ts
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { signToken } from '../utils/jwt'
import { generateOTP } from '../utils/otp'
import { sendOtpEmail, sendWelcomeEmail } from '../services/email.service'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: 'email, password, firstName and lastName are required'
      })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const hash = await bcrypt.hash(password, 10)
    const otp = generateOTP()
    console.log(otp)

    await User.create({
      email,
      password: hash,
      firstName,
      lastName,
      role,
      otp,
      otpCreatedAt: new Date(),
      isVerified: false
    })

    await sendOtpEmail(email, otp)

    return res.status(201).json({
      message: 'Registered successfully. OTP sent to email.'
    })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: 'email and otp are required' })
    }

    const user = await User.findOne({ email, otp })
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    user.isVerified = true
    user.otp = undefined
    user.otpCreatedAt = undefined
    await user.save()

    await sendWelcomeEmail(email, user.firstName)

    const token = signToken({ id: user.id, role: user.role })

    return res.json({ token })
  } catch (err) {
    console.error('Verify OTP error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'email is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' })
    }

    const otp = generateOTP()
    console.log(otp)
    user.otp = otp
    user.otpCreatedAt = new Date()
    await user.save()

    await sendOtpEmail(email, otp)

    return res.json({ message: 'OTP resent successfully' })
  } catch (err) {
    console.error('Resend OTP error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.isVerified) {
      const otp = generateOTP()
      console.log(otp)
      user.otp = otp
      user.otpCreatedAt = new Date()
      await user.save()

      await sendOtpEmail(email, otp)

      return res.status(403).json({
        message: 'Email not verified. OTP sent again.'
      })
    }

    const token = signToken({ id: user.id, role: user.role })
    return res.json({ token })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = await User.findById(userId).select(
      '-password -otp -otpCreatedAt'
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ user })
  } catch (err) {
    console.error('Get profile error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}