import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Stripe only if key is provided
let stripe = null

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',
  })
} else {
  console.warn('⚠️  WARNING: STRIPE_SECRET_KEY is not set in environment variables.')
  console.warn('⚠️  Payment processing will not work until you add your Stripe secret key to backend/.env')
  console.warn('⚠️  Get your key from: https://dashboard.stripe.com/test/apikeys')
  // Create a mock object to prevent crashes when Stripe methods are called
  stripe = {
    paymentIntents: {
      create: async () => {
        throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to backend/.env')
      },
      retrieve: async () => {
        throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to backend/.env')
      }
    },
    webhooks: {
      constructEvent: () => {
        throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to backend/.env')
      }
    }
  }
}

export default stripe

