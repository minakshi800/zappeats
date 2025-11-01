import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, no token provided' 
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from token
      req.userId = decoded.userId
      next()
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, invalid token' 
      })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    })
  }
}

