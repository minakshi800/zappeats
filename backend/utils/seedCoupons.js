import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import Coupon from '../models/Coupon.js'

dotenv.config()

const seedCoupons = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing coupons
    await Coupon.deleteMany({})
    console.log('Cleared existing coupons')

    // Create coupons
    const coupons = [
      {
        code: 'WELCOME20',
        description: 'Welcome discount - 20% off on your first order',
        discountType: 'percentage',
        discountValue: 20,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        minOrderAmount: 10,
        maxDiscount: 15,
        applicableOn: 'all'
      },
      {
        code: 'SAVE15',
        description: 'Save $15 on orders above $50',
        discountType: 'fixed',
        discountValue: 15,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        minOrderAmount: 50,
        applicableOn: 'all'
      },
      {
        code: 'FREEDEL',
        description: 'Free delivery on all orders',
        discountType: 'free_delivery',
        discountValue: 0,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        minOrderAmount: 0,
        applicableOn: 'all'
      },
      {
        code: 'FLAT10',
        description: 'Flat $10 off on orders above $25',
        discountType: 'fixed',
        discountValue: 10,
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        minOrderAmount: 25,
        applicableOn: 'all'
      },
      {
        code: 'SUMMER25',
        description: 'Summer special - 25% off on your order',
        discountType: 'percentage',
        discountValue: 25,
        validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        minOrderAmount: 20,
        maxDiscount: 30,
        applicableOn: 'all'
      }
    ]

    const createdCoupons = await Coupon.insertMany(coupons)
    console.log(`Inserted ${createdCoupons.length} coupons`)
    console.log('\nAvailable coupon codes:')
    createdCoupons.forEach(coupon => {
      console.log(`  - ${coupon.code}: ${coupon.description}`)
    })

    console.log('\nCoupons seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding coupons:', error)
    process.exit(1)
  }
}

seedCoupons()

