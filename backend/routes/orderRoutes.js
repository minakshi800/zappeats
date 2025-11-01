import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createOrder)
router.get('/', protect, getMyOrders)
router.get('/:id', protect, getOrder)
router.put('/:id/status', protect, updateOrderStatus)
router.put('/:id/cancel', protect, cancelOrder)

export default router

