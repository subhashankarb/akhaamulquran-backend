// src/server.ts
import './config/env'
import express from 'express'
import cors from 'cors'
import connectMongoDB from './config/mongodb'
import connectClickHouse from './config/clickhouse'
import emailConfig from './config/email'
import authRoutes from './routes/auth.routes'
import apiLogger from './utils/apiLogger'
import { seedAdmin } from './seed/adminseed'


const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(apiLogger)

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 4000

;(async () => {
  await connectMongoDB()
  connectClickHouse()
  await emailConfig.verifyConnection()

  // 2. Run the seeder after DB connection, before server listen
  await seedAdmin()

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
  })
})()