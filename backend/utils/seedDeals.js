import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import Deal from '../models/Deal.js'
import Restaurant from '../models/Restaurant.js'
import MenuItem from '../models/MenuItem.js'

dotenv.config()

const seedDeals = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Get some restaurants and menu items
    const restaurants = await Restaurant.find().limit(3)
    const menuItems = await MenuItem.find().limit(10)

    // Clear existing deals
    await Deal.deleteMany({})
    console.log('Cleared existing deals')

    // Create deals
    const deals = [
      {
        title: '50% Off on All Pizzas',
        description: 'Get amazing 50% discount on all pizza orders. Valid on orders above $20.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        discountType: 'percentage',
        discountValue: 50,
        code: 'PIZZA50',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        minOrderAmount: 20,
        maxDiscount: 25,
        applicableOn: 'specific_restaurants',
        restaurantIds: restaurants.filter(r => r.cuisine === 'Italian').map(r => r._id)
      },
      {
        title: '$10 Off on Orders Above $30',
        description: 'Save $10 on your order when you spend more than $30. Perfect for family meals!',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        discountType: 'fixed',
        discountValue: 10,
        code: 'SAVE10',
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        minOrderAmount: 30,
        applicableOn: 'all'
      },
      {
        title: 'Buy 1 Get 1 Free',
        description: 'Buy any main course and get another one free! Limited time offer.',
        image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800',
        discountType: 'buy_one_get_one',
        discountValue: 100,
        code: 'BOGO100',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        minOrderAmount: 15,
        applicableOn: 'specific_items',
        menuItemIds: menuItems.filter(item => item.category === 'main').slice(0, 5).map(item => item._id)
      },
      {
        title: 'Free Delivery on All Orders',
        description: 'Enjoy free delivery on all orders, no minimum required. Order now!',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        discountType: 'free_delivery',
        discountValue: 0,
        code: 'FREEDEL',
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        minOrderAmount: 0,
        applicableOn: 'all'
      },
      {
        title: '30% Off Chinese Cuisine',
        description: 'Special discount on all Chinese restaurants. Authentic flavors at great prices!',
        image: 'https://images.unsplash.com/photo-1552568043-0b5c02c30a48?w=800',
        discountType: 'percentage',
        discountValue: 30,
        code: 'CHINESE30',
        validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        minOrderAmount: 25,
        maxDiscount: 20,
        applicableOn: 'specific_restaurants',
        restaurantIds: restaurants.filter(r => r.cuisine === 'Chinese').map(r => r._id)
      }
    ]

    const createdDeals = await Deal.insertMany(deals)
    console.log(`Inserted ${createdDeals.length} deals`)

    console.log('Deals seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding deals:', error)
    process.exit(1)
  }
}

seedDeals()

