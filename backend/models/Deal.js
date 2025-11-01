import mongoose from 'mongoose'

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide deal title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide deal description'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'buy_one_get_one', 'free_delivery'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    unique: true,
    uppercase: true,
    default: function() {
      return Math.random().toString(36).substring(2, 8).toUpperCase()
    }
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  restaurantIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  menuItemIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  applicableOn: {
    type: String,
    enum: ['all', 'specific_restaurants', 'specific_items'],
    default: 'all'
  }
}, {
  timestamps: true
})

const Deal = mongoose.model('Deal', dealSchema)

export default Deal

