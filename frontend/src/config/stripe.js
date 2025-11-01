import { loadStripe } from '@stripe/stripe-js'

// Get publishable key from environment variable or use test key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Q8vxqL2Q7sXzK8v')

export default stripePromise

