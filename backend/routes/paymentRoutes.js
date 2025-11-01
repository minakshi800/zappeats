import express from 'express'
import {
  createPaymentIntent,
  createOrderWithPayment,
  verifyPayment,
  handleWebhook
} from '../controllers/paymentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Protected routes
router.post('/create-intent', protect, createPaymentIntent)
router.post('/create-order', protect, createOrderWithPayment)
router.post('/verify', protect, verifyPayment)

// Export webhook handler separately (handled in server.js with raw body)
export { handleWebhook }
export default router

