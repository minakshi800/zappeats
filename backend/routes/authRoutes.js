import express from 'express'
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  updatePassword, 
  deleteAccount 
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/update-password', protect, updatePassword)
router.delete('/delete-account', protect, deleteAccount)

export default router

