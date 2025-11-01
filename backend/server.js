import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import restaurantRoutes from './routes/restaurantRoutes.js'
import dealRoutes from './routes/dealRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import { handleWebhook } from './routes/paymentRoutes.js'

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' 
    ? false 
    : 'http://localhost:3000'),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// If no frontend URL is set in production, allow all (for development)
if (process.env.NODE_ENV !== 'production' || !process.env.FRONTEND_URL) {
  corsOptions.origin = true // Allow all origins in development
}

app.use(cors(corsOptions))

// Stripe webhook route needs raw body, so it must be before express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook)

// Regular middleware for other routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'ZappEats API Server is running' })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/deals', dealRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/coupons', couponRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  
  // Don't leak error details in production
  const errorMessage = process.env.NODE_ENV === 'production'
    ? 'Something went wrong!'
    : err.message
    
  res.status(err.status || 500).json({ 
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV !== 'production' && { error: err.message, stack: err.stack })
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
  if (process.env.NODE_ENV === 'production') {
    console.log(`✅ Production mode enabled`)
    console.log(`🔒 CORS enabled for: ${process.env.FRONTEND_URL || 'ALL (configure FRONTEND_URL)'}`)
  }
})

