import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  photos: [{
    type: String
  }]
}, {
  timestamps: true
})

// Update restaurant rating when review is saved
reviewSchema.post('save', async function() {
  try {
    const Review = mongoose.model('Review')
    const Restaurant = mongoose.model('Restaurant')
    
    const reviews = await Review.find({ restaurantId: this.restaurantId })
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      
      await Restaurant.findByIdAndUpdate(this.restaurantId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length
      })
    }
  } catch (error) {
    console.error('Error updating restaurant rating:', error)
  }
})

const Review = mongoose.model('Review', reviewSchema)

export default Review

