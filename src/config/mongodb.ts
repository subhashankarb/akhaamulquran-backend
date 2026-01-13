// src/config/mongodb.ts
import mongoose from 'mongoose'

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI not defined')
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection failed', err)
    process.exit(1)
  }
}

export default connectMongoDB
