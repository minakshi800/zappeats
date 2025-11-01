import Coupon from '../models/Coupon.js'

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartItems, subtotal } = req.body

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      })
    }

    const coupon = await Coupon.findOne({ 
      code: code.trim().toUpperCase(),
      isActive: true 
    })

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      })
    }

    // Check if coupon is expired
    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired'
      })
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit reached'
      })
    }

    // Check minimum order amount
    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${coupon.minOrderAmount} required`
      })
    }

    // Check if coupon is applicable to cart items
    if (coupon.applicableOn === 'specific_restaurants') {
      const restaurantIds = cartItems.map(item => item.restaurantId).filter(Boolean)
      const hasApplicableRestaurant = restaurantIds.some(id => 
        coupon.restaurantIds.some(rid => rid.toString() === id.toString())
      )
      if (!hasApplicableRestaurant) {
        return res.status(400).json({
          success: false,
          message: 'Coupon is not applicable to items in your cart'
        })
      }
    }

    if (coupon.applicableOn === 'specific_items') {
      const itemIds = cartItems.map(item => item.id).filter(Boolean)
      const hasApplicableItem = itemIds.some(id => 
        coupon.menuItemIds.some(mid => mid.toString() === id.toString())
      )
      if (!hasApplicableItem) {
        return res.status(400).json({
          success: false,
          message: 'Coupon is not applicable to items in your cart'
        })
      }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = subtotal * (coupon.discountValue / 100)
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount)
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, subtotal)
    } else if (coupon.discountType === 'free_delivery') {
      discountAmount = 0 // Will be applied to delivery fee
    }

    res.status(200).json({
      success: true,
      data: {
        couponId: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discountAmount,
        description: coupon.description
      }
    })
  } catch (error) {
    console.error('Validate coupon error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ 
      isActive: true,
      validUntil: { $gte: new Date() }
    }).select('code description discountType discountValue validUntil minOrderAmount')

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    })
  } catch (error) {
    console.error('Get coupons error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

