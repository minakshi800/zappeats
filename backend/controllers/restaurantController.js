import Restaurant from '../models/Restaurant.js'
import Review from '../models/Review.js'
import MenuItem from '../models/MenuItem.js'
import TableBooking from '../models/TableBooking.js'

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
  try {
    const { cuisine, search, sort } = req.query
    const query = { isActive: true }

    if (cuisine) {
      // Support array of cuisines for categories like "Asian"
      if (Array.isArray(cuisine)) {
        query.cuisine = { $in: cuisine }
      } else {
        query.cuisine = cuisine
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    let sortOption = {}
    if (sort === 'rating') {
      sortOption = { rating: -1 }
    } else if (sort === 'deliveryTime') {
      sortOption = { deliveryTime: 1 }
    } else {
      sortOption = { createdAt: -1 }
    }

    const restaurants = await Restaurant.find(query).sort(sortOption)

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    })
  } catch (error) {
    console.error('Get restaurants error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      })
    }

    res.status(200).json({
      success: true,
      data: restaurant
    })
  } catch (error) {
    console.error('Get restaurant error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get restaurant reviews
// @route   GET /api/restaurants/:id/reviews
// @access  Public
export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Create restaurant review
// @route   POST /api/restaurants/:id/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { rating, comment, photos } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating (1-5)'
      })
    }

    const review = await Review.create({
      userId: req.userId,
      restaurantId: req.params.id,
      rating,
      comment,
      photos: photos || []
    })

    await review.populate('userId', 'name avatar')

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    })
  } catch (error) {
    console.error('Create review error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get restaurant menu
// @route   GET /api/restaurants/:id/menu
// @access  Public
export const getRestaurantMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      restaurantId: req.params.id,
      isAvailable: true 
    }).sort({ category: 1, name: 1 })

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    })
  } catch (error) {
    console.error('Get menu error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Search food items
// @route   GET /api/restaurants/search/food
// @access  Public
export const searchFood = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      })
    }

    const searchQuery = q.trim()

    // Search menu items by name or description
    const menuItems = await MenuItem.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { ingredients: { $in: [new RegExp(searchQuery, 'i')] } }
      ],
      isAvailable: true
    })
      .populate('restaurantId', 'name')
      .limit(20)
      .sort({ name: 1 })

    // Format results with restaurant info
    const results = menuItems
      .filter(item => item.restaurantId) // Filter out items without restaurant
      .map(item => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: item.category,
        restaurantId: item.restaurantId._id,
        restaurantName: item.restaurantId.name
      }))

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    })
  } catch (error) {
    console.error('Search food error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Book a table
// @route   POST /api/restaurants/:id/book-table
// @access  Private
export const bookTable = async (req, res) => {
  try {
    const { date, time, numberOfGuests, mealType, specialRequests, contactPhone } = req.body

    if (!date || !time || !numberOfGuests || !mealType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (date, time, numberOfGuests, mealType)'
      })
    }

    const booking = await TableBooking.create({
      userId: req.userId,
      restaurantId: req.params.id,
      date: new Date(date),
      time,
      numberOfGuests,
      mealType,
      specialRequests: specialRequests || '',
      contactPhone: contactPhone || ''
    })

    res.status(201).json({
      success: true,
      message: 'Table booked successfully',
      data: booking
    })
  } catch (error) {
    console.error('Book table error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

