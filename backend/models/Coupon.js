import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'free_delivery'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
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
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableOn: {
    type: String,
    enum: ['all', 'specific_restaurants', 'specific_items'],
    default: 'all'
  },
  restaurantIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  menuItemIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]
}, {
  timestamps: true
})

const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon

