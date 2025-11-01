import Deal from '../models/Deal.js'
import Restaurant from '../models/Restaurant.js'
import MenuItem from '../models/MenuItem.js'

// @desc    Get all active deals
// @route   GET /api/deals
// @access  Public
export const getDeals = async (req, res) => {
  try {
    const now = new Date()
    const deals = await Deal.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals
    })
  } catch (error) {
    console.error('Get deals error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Public
export const getDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('restaurantIds', 'name image cuisine rating deliveryTime deliveryFee')
      .populate('menuItemIds', 'name price image description category restaurantId')

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      })
    }

    res.status(200).json({
      success: true,
      data: deal
    })
  } catch (error) {
    console.error('Get deal error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get restaurants/food for a deal
// @route   GET /api/deals/:id/items
// @access  Public
export const getDealItems = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      })
    }

    let restaurants = []
    let menuItems = []

    if (deal.applicableOn === 'all') {
      // Get all restaurants
      restaurants = await Restaurant.find({ isActive: true })
        .limit(20)
        .sort({ rating: -1 })
      
      // Get popular menu items
      menuItems = await MenuItem.find({ isAvailable: true })
        .populate('restaurantId', 'name')
        .limit(30)
        .sort({ createdAt: -1 })
    } else if (deal.applicableOn === 'specific_restaurants') {
      // Get specific restaurants
      restaurants = await Restaurant.find({ 
        _id: { $in: deal.restaurantIds },
        isActive: true 
      })
      
      // Get menu items from those restaurants
      menuItems = await MenuItem.find({ 
        restaurantId: { $in: deal.restaurantIds },
        isAvailable: true 
      }).populate('restaurantId', 'name')
    } else if (deal.applicableOn === 'specific_items') {
      // Get specific menu items
      menuItems = await MenuItem.find({ 
        _id: { $in: deal.menuItemIds },
        isAvailable: true 
      }).populate('restaurantId', 'name')
      
      // Get restaurants for those items
      const restaurantIds = [...new Set(menuItems.map(item => item.restaurantId?._id))]
      restaurants = await Restaurant.find({ 
        _id: { $in: restaurantIds },
        isActive: true 
      })
    }

    res.status(200).json({
      success: true,
      data: {
        restaurants,
        menuItems
      }
    })
  } catch (error) {
    console.error('Get deal items error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

