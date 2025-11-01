import express from 'express'
import {
  getDeals,
  getDeal,
  getDealItems
} from '../controllers/dealController.js'

const router = express.Router()

router.get('/', getDeals)
router.get('/:id', getDeal)
router.get('/:id/items', getDealItems)

export default router

