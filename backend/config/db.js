import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || 'zappeats'
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: dbName
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log(`Database: ${conn.connection.name}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB