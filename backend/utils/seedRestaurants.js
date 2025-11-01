import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import Restaurant from '../models/Restaurant.js'
import MenuItem from '../models/MenuItem.js'

dotenv.config()

const restaurants = [
  {
    name: 'Pizza Paradise',
    description: 'Authentic Italian pizzas made with fresh ingredients and traditional recipes. Our wood-fired oven gives each pizza that perfect crispy crust.',
    cuisine: 'Italian',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1555396273-3677a3db5db8?w=800',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
    ],
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: '30-40 mins',
    deliveryFee: 2.99,
    minimumOrder: 15,
    phone: '+1 (555) 123-4567',
    email: 'info@pizzaparadise.com',
    location: {
      address: '123 Main Street',
      city: 'New York',
      zipCode: '10001'
    }
  },
  {
    name: 'Dragon Wok',
    description: 'Experience authentic Chinese cuisine with our chef\'s special dishes. From spicy Szechuan to delicate Cantonese, we bring you the best of China.',
    cuisine: 'Chinese',
    image: 'https://images.unsplash.com/photo-1552568043-0b5c02c30a48?w=800',
    photos: [
      'https://images.unsplash.com/photo-1552568043-0b5c02c30a48?w=800',
      'https://images.unsplash.com/photo-1563379091339-03246963d8c7?w=800'
    ],
    rating: 4.7,
    reviewCount: 89,
    deliveryTime: '25-35 mins',
    deliveryFee: 3.49,
    minimumOrder: 20,
    phone: '+1 (555) 234-5678',
    email: 'order@dragonwok.com',
    location: {
      address: '456 Food Avenue',
      city: 'New York',
      zipCode: '10002'
    }
  },
  {
    name: 'Spice Route',
    description: 'Traditional Indian flavors with a modern twist. Our chefs bring you authentic curries, tandoori specialties, and fresh naan bread.',
    cuisine: 'Indian',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    photos: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'
    ],
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: '35-45 mins',
    deliveryFee: 2.49,
    minimumOrder: 18,
    phone: '+1 (555) 345-6789',
    email: 'hello@spiceroute.com',
    location: {
      address: '789 Curry Lane',
      city: 'New York',
      zipCode: '10003'
    }
  }
]

const menuItems = [
  // Pizza Paradise menu
  {
    restaurantId: null, // Will be set after restaurant creation
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    ingredients: ['Tomato sauce', 'Mozzarella', 'Fresh basil', 'Olive oil']
  },
  {
    restaurantId: null,
    name: 'Pepperoni Pizza',
    description: 'Traditional pepperoni with mozzarella cheese',
    price: 14.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800'
  },
  {
    restaurantId: null,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing',
    price: 8.99,
    category: 'salad'
  },
  {
    restaurantId: null,
    name: 'Tiramisu',
    description: 'Classic Italian dessert',
    price: 6.99,
    category: 'dessert'
  },
  {
    restaurantId: null,
    name: 'Coca Cola',
    description: 'Refreshing soft drink',
    price: 2.99,
    category: 'beverage'
  }
]

const seedDatabase = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    await Restaurant.deleteMany({})
    await MenuItem.deleteMany({})
    console.log('Cleared existing data')

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants)
    console.log(`Inserted ${createdRestaurants.length} restaurants`)

    // Add menu items for first restaurant
    const pizzaParadise = createdRestaurants.find(r => r.name === 'Pizza Paradise')
    if (pizzaParadise) {
      const pizzaMenu = menuItems.map(item => ({
        ...item,
        restaurantId: pizzaParadise._id
      }))
      await MenuItem.insertMany(pizzaMenu)
      console.log(`Inserted menu items for ${pizzaParadise.name}`)
    }

    console.log('Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()

