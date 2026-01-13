// src/models/User.ts
import { Schema, model } from 'mongoose'

export type Role = 'user' | 'admin' | 'subadmin'

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'subadmin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpCreatedAt: { type: Date }
  },
  { timestamps: true }
)

UserSchema.index({ otpCreatedAt: 1 }, { expireAfterSeconds: 600 })

export default model('User', UserSchema)
