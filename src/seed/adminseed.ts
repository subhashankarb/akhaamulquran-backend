// src/adminseed.ts
import User from '../models/User'
import bcrypt from 'bcryptjs'


export const seedAdmin = async () => {
  try {
    const adminEmail = "admin@quran.com"
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (!existingAdmin) {
      console.log('🌱 Seeding admin user...')

      // Hash the password so you can login later
      const hashedPassword = await bcrypt.hash("12345678", 10)

      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        firstName: "Subha",
        lastName: "Shankar",
        role: "admin",
        isVerified: true, // Auto-verify the admin
      })

      await adminUser.save()
      console.log('✅ Admin user seeded successfully.')
    } else {
      // Optional: Log that admin already exists
      // console.log('ℹ️ Admin user already exists.')
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error)
  }
}