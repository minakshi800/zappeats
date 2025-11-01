import express from 'express'
import {
  getRestaurants,
  getRestaurant,
  getRestaurantReviews,
  createReview,
  getRestaurantMenu,
  searchFood,
  bookTable
} from '../controllers/restaurantController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getRestaurants)
router.get('/search/food', searchFood)
router.get('/:id', getRestaurant)
router.get('/:id/reviews', getRestaurantReviews)
router.post('/:id/reviews', protect, createReview)
router.get('/:id/menu', getRestaurantMenu)
router.post('/:id/book-table', protect, bookTable)

export default router

