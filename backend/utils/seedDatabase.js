import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import Restaurant from '../models/Restaurant.js'
import MenuItem from '../models/MenuItem.js'
import Deal from '../models/Deal.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Restaurant.deleteMany({})
    await MenuItem.deleteMany({})
    await Deal.deleteMany({})

    // ===== RESTAURANTS =====
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
        rating: 4.6,
        reviewCount: 342,
        deliveryTime: '25-35 mins',
        deliveryFee: 2.99,
        minimumOrder: 15,
        phone: '+1 (555) 123-4567',
        email: 'info@pizzaparadise.com',
        location: {
          address: '123 Main Street',
          city: 'New York',
          zipCode: '10001'
        },
        openingHours: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '11:00', close: '23:00' },
          sunday: { open: '12:00', close: '22:00' }
        },
        isActive: true
      },
      {
        name: 'Burger King Palace',
        description: 'Premium gourmet burgers with fresh ingredients. From classic cheeseburgers to exotic specialty burgers, we have something for everyone.',
        cuisine: 'American',
        image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800',
        photos: [
          'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800',
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
        ],
        rating: 4.5,
        reviewCount: 289,
        deliveryTime: '20-30 mins',
        deliveryFee: 2.49,
        minimumOrder: 12,
        phone: '+1 (555) 234-5678',
        email: 'order@burgerkingpalace.com',
        location: {
          address: '456 Food Avenue',
          city: 'New York',
          zipCode: '10002'
        },
        openingHours: {
          monday: { open: '10:00', close: '23:00' },
          tuesday: { open: '10:00', close: '23:00' },
          wednesday: { open: '10:00', close: '23:00' },
          thursday: { open: '10:00', close: '23:00' },
          friday: { open: '10:00', close: '24:00' },
          saturday: { open: '10:00', close: '24:00' },
          sunday: { open: '11:00', close: '22:00' }
        },
        isActive: true
      },
      {
        name: 'Sweet Dreams Desserts',
        description: 'Indulge in our heavenly desserts. From ice cream sundaes to gourmet cakes, satisfy your sweet tooth with our delightful treats.',
        cuisine: 'American',
        image: 'https://images.unsplash.com/photo-1563805042-7688c019e175?w=800',
        photos: [
          'https://images.unsplash.com/photo-1563805042-7688c019e175?w=800',
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'
        ],
        rating: 4.8,
        reviewCount: 156,
        deliveryTime: '15-25 mins',
        deliveryFee: 1.99,
        minimumOrder: 10,
        phone: '+1 (555) 345-6789',
        email: 'sweet@dreamsdesserts.com',
        location: {
          address: '789 Dessert Lane',
          city: 'New York',
          zipCode: '10003'
        },
        openingHours: {
          monday: { open: '12:00', close: '22:00' },
          tuesday: { open: '12:00', close: '22:00' },
          wednesday: { open: '12:00', close: '22:00' },
          thursday: { open: '12:00', close: '22:00' },
          friday: { open: '12:00', close: '23:00' },
          saturday: { open: '12:00', close: '23:00' },
          sunday: { open: '13:00', close: '21:00' }
        },
        isActive: true
      },
      {
        name: 'Bubble Tea Hub',
        description: 'Fresh bubble teas, smoothies, and specialty drinks. Cool down with our refreshing beverages made with premium ingredients.',
        cuisine: 'American',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
        photos: [
          'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'
        ],
        rating: 4.7,
        reviewCount: 203,
        deliveryTime: '15-20 mins',
        deliveryFee: 1.49,
        minimumOrder: 8,
        phone: '+1 (555) 456-7890',
        email: 'drinks@bubbleteahub.com',
        location: {
          address: '321 Beverage Boulevard',
          city: 'New York',
          zipCode: '10004'
        },
        openingHours: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '10:00', close: '22:00' },
          sunday: { open: '11:00', close: '20:00' }
        },
        isActive: true
      },
      {
        name: 'Chicken Delight',
        description: 'Crispy fried chicken, grilled chicken, and wings. Our secret recipe has been passed down for generations.',
        cuisine: 'American',
        image: 'https://images.unsplash.com/photo-1626087927381-6c0f5e5e6b9f?w=800',
        photos: [
          'https://images.unsplash.com/photo-1626087927381-6c0f5e5e6b9f?w=800',
          'https://images.unsplash.com/photo-1562967914-608f82629710?w=800'
        ],
        rating: 4.4,
        reviewCount: 278,
        deliveryTime: '20-30 mins',
        deliveryFee: 2.99,
        minimumOrder: 15,
        phone: '+1 (555) 567-8901',
        email: 'order@chickendelight.com',
        location: {
          address: '654 Poultry Parkway',
          city: 'New York',
          zipCode: '10005'
        },
        openingHours: {
          monday: { open: '11:00', close: '23:00' },
          tuesday: { open: '11:00', close: '23:00' },
          wednesday: { open: '11:00', close: '23:00' },
          thursday: { open: '11:00', close: '23:00' },
          friday: { open: '11:00', close: '24:00' },
          saturday: { open: '11:00', close: '24:00' },
          sunday: { open: '12:00', close: '22:00' }
        },
        isActive: true
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
        reviewCount: 445,
        deliveryTime: '25-35 mins',
        deliveryFee: 3.49,
        minimumOrder: 20,
        phone: '+1 (555) 678-9012',
        email: 'order@dragonwok.com',
        location: {
          address: '987 Asian Avenue',
          city: 'New York',
          zipCode: '10006'
        },
        openingHours: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '11:00', close: '23:00' },
          sunday: { open: '12:00', close: '21:00' }
        },
        isActive: true
      },
      {
        name: 'Sushi Master',
        description: 'Fresh sushi and Japanese cuisine prepared by master chefs. Experience the authentic taste of Japan.',
        cuisine: 'Japanese',
        image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800',
        photos: [
          'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800',
          'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800'
        ],
        rating: 4.9,
        reviewCount: 512,
        deliveryTime: '30-40 mins',
        deliveryFee: 3.99,
        minimumOrder: 25,
        phone: '+1 (555) 789-0123',
        email: 'info@sushimaster.com',
        location: {
          address: '159 Sushi Street',
          city: 'New York',
          zipCode: '10007'
        },
        openingHours: {
          monday: { open: '17:00', close: '22:00' },
          tuesday: { open: '17:00', close: '22:00' },
          wednesday: { open: '17:00', close: '22:00' },
          thursday: { open: '17:00', close: '22:00' },
          friday: { open: '17:00', close: '23:00' },
          saturday: { open: '17:00', close: '23:00' },
          sunday: { open: '17:00', close: '21:00' }
        },
        isActive: true
      },
      {
        name: 'Spice Route Indian',
        description: 'Authentic Indian cuisine with rich flavors and aromatic spices. From creamy curries to tandoori specialties.',
        cuisine: 'Indian',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        photos: [
          'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
          'https://images.unsplash.com/photo-1563379091339-03246963d8c7?w=800'
        ],
        rating: 4.6,
        reviewCount: 367,
        deliveryTime: '30-40 mins',
        deliveryFee: 3.99,
        minimumOrder: 18,
        phone: '+1 (555) 890-1234',
        email: 'order@spiceroute.com',
        location: {
          address: '741 Spice Street',
          city: 'New York',
          zipCode: '10008'
        },
        openingHours: {
          monday: { open: '11:30', close: '22:30' },
          tuesday: { open: '11:30', close: '22:30' },
          wednesday: { open: '11:30', close: '22:30' },
          thursday: { open: '11:30', close: '22:30' },
          friday: { open: '11:30', close: '23:30' },
          saturday: { open: '11:30', close: '23:30' },
          sunday: { open: '12:00', close: '22:00' }
        },
        isActive: true
      },
      {
        name: 'El Fiesta Mexicana',
        description: 'Traditional Mexican dishes with bold flavors. Fresh tacos, burritos, and authentic salsas made daily.',
        cuisine: 'Mexican',
        image: 'https://images.unsplash.com/photo-1565299585323-38174c92641b?w=800',
        photos: [
          'https://images.unsplash.com/photo-1565299585323-38174c92641b?w=800',
          'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800'
        ],
        rating: 4.5,
        reviewCount: 291,
        deliveryTime: '25-35 mins',
        deliveryFee: 2.99,
        minimumOrder: 15,
        phone: '+1 (555) 901-2345',
        email: 'info@elfiesta.com',
        location: {
          address: '852 Taco Avenue',
          city: 'New York',
          zipCode: '10009'
        },
        openingHours: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '11:00', close: '23:00' },
          sunday: { open: '12:00', close: '21:00' }
        },
        isActive: true
      },
      {
        name: 'Thai Garden',
        description: 'Authentic Thai cuisine featuring Pad Thai, Green Curry, and Tom Yum soup. Experience the perfect balance of sweet, sour, and spicy.',
        cuisine: 'Thai',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        photos: [
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
          'https://images.unsplash.com/photo-1571997478779-1adc6e61910b?w=800'
        ],
        rating: 4.7,
        reviewCount: 324,
        deliveryTime: '25-35 mins',
        deliveryFee: 3.49,
        minimumOrder: 20,
        phone: '+1 (555) 012-3456',
        email: 'order@thaigarden.com',
        location: {
          address: '963 Asian Boulevard',
          city: 'New York',
          zipCode: '10010'
        },
        openingHours: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '11:00', close: '23:00' },
          sunday: { open: '12:00', close: '21:00' }
        },
        isActive: true
      }
    ]

    const createdRestaurants = await Restaurant.insertMany(restaurants)
    console.log(`✅ Inserted ${createdRestaurants.length} restaurants`)

    // Find restaurants by name
    const pizzaParadise = createdRestaurants.find(r => r.name === 'Pizza Paradise')
    const burgerPalace = createdRestaurants.find(r => r.name === 'Burger King Palace')
    const sweetDreams = createdRestaurants.find(r => r.name === 'Sweet Dreams Desserts')
    const bubbleTea = createdRestaurants.find(r => r.name === 'Bubble Tea Hub')
    const chickenDelight = createdRestaurants.find(r => r.name === 'Chicken Delight')
    const dragonWok = createdRestaurants.find(r => r.name === 'Dragon Wok')
    const sushiMaster = createdRestaurants.find(r => r.name === 'Sushi Master')
    const spiceRoute = createdRestaurants.find(r => r.name === 'Spice Route Indian')
    const elFiesta = createdRestaurants.find(r => r.name === 'El Fiesta Mexicana')
    const thaiGarden = createdRestaurants.find(r => r.name === 'Thai Garden')

    // ===== MENU ITEMS =====
    const menuItems = [
      // Pizza Paradise - Pizza category
      {
        restaurantId: pizzaParadise._id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 12.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        isAvailable: true,
        ingredients: ['Tomato sauce', 'Mozzarella', 'Fresh basil', 'Olive oil'],
        dietaryInfo: { vegetarian: true }
      },
      {
        restaurantId: pizzaParadise._id,
        name: 'Pepperoni Pizza',
        description: 'Traditional pepperoni with mozzarella cheese and tomato sauce',
        price: 14.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
        isAvailable: true
      },
      {
        restaurantId: pizzaParadise._id,
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken, red onions, and BBQ sauce',
        price: 16.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
        isAvailable: true
      },
      {
        restaurantId: pizzaParadise._id,
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing and croutons',
        price: 8.99,
        category: 'salad',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      },
      {
        restaurantId: pizzaParadise._id,
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 6.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
        isAvailable: true
      },
      {
        restaurantId: pizzaParadise._id,
        name: 'Coca Cola',
        description: 'Refreshing soft drink',
        price: 2.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800',
        isAvailable: true
      },

      // Burger King Palace - Burgers category
      {
        restaurantId: burgerPalace._id,
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
        price: 9.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800',
        isAvailable: true
      },
      {
        restaurantId: burgerPalace._id,
        name: 'Bacon Deluxe Burger',
        description: 'Double patty with crispy bacon, cheddar cheese, and onion rings',
        price: 12.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        isAvailable: true
      },
      {
        restaurantId: burgerPalace._id,
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables and special sauce',
        price: 10.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1525059696034-4967a7290028?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true, vegan: true }
      },
      {
        restaurantId: burgerPalace._id,
        name: 'French Fries',
        description: 'Crispy golden fries with salt',
        price: 4.99,
        category: 'side',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true, vegan: true }
      },
      {
        restaurantId: burgerPalace._id,
        name: 'Chocolate Shake',
        description: 'Creamy chocolate milkshake',
        price: 5.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800',
        isAvailable: true
      },

      // Sweet Dreams Desserts - Desserts category
      {
        restaurantId: sweetDreams._id,
        name: 'Chocolate Ice Cream',
        description: 'Rich and creamy chocolate ice cream',
        price: 4.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1563805042-7688c019e175?w=800',
        isAvailable: true
      },
      {
        restaurantId: sweetDreams._id,
        name: 'Strawberry Cheesecake',
        description: 'Creamy cheesecake with fresh strawberries',
        price: 7.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
        isAvailable: true
      },
      {
        restaurantId: sweetDreams._id,
        name: 'Vanilla Cupcake',
        description: 'Soft vanilla cupcake with buttercream frosting',
        price: 3.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800',
        isAvailable: true
      },
      {
        restaurantId: sweetDreams._id,
        name: 'Chocolate Brownie',
        description: 'Warm chocolate brownie with ice cream',
        price: 6.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
        isAvailable: true
      },
      {
        restaurantId: sweetDreams._id,
        name: 'Ice Cream Sundae',
        description: 'Vanilla ice cream with chocolate sauce and nuts',
        price: 5.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
        isAvailable: true
      },

      // Bubble Tea Hub - Drinks category
      {
        restaurantId: bubbleTea._id,
        name: 'Classic Bubble Tea',
        description: 'Traditional bubble tea with tapioca pearls',
        price: 5.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
        isAvailable: true
      },
      {
        restaurantId: bubbleTea._id,
        name: 'Mango Smoothie',
        description: 'Fresh mango smoothie with yogurt',
        price: 6.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
        isAvailable: true
      },
      {
        restaurantId: bubbleTea._id,
        name: 'Strawberry Lemonade',
        description: 'Fresh strawberry lemonade',
        price: 4.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2bdc?w=800',
        isAvailable: true
      },
      {
        restaurantId: bubbleTea._id,
        name: 'Coffee Frappuccino',
        description: 'Iced coffee blended with ice',
        price: 5.49,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
        isAvailable: true
      },
      {
        restaurantId: bubbleTea._id,
        name: 'Green Tea Latte',
        description: 'Smooth green tea with steamed milk',
        price: 4.49,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
        isAvailable: true
      },

      // Chicken Delight - Chicken category
      {
        restaurantId: chickenDelight._id,
        name: 'Crispy Fried Chicken',
        description: '6 pieces of crispy fried chicken with secret spices',
        price: 14.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1626087927381-6c0f5e5e6b9f?w=800',
        isAvailable: true
      },
      {
        restaurantId: chickenDelight._id,
        name: 'Grilled Chicken Breast',
        description: 'Tender grilled chicken breast with herbs',
        price: 12.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800',
        isAvailable: true
      },
      {
        restaurantId: chickenDelight._id,
        name: 'Chicken Wings (10 pieces)',
        description: 'Spicy buffalo wings with blue cheese',
        price: 11.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1527477396000-e7a5e8b8e5a4?w=800',
        isAvailable: true,
        dietaryInfo: { spicy: true }
      },
      {
        restaurantId: chickenDelight._id,
        name: 'Chicken Sandwich',
        description: 'Crispy chicken fillet with lettuce and mayo',
        price: 9.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e166a853?w=800',
        isAvailable: true
      },
      {
        restaurantId: chickenDelight._id,
        name: 'Chicken Tenders (5 pieces)',
        description: 'Breaded chicken tenders with dipping sauce',
        price: 8.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1608039829573-88bf2a6c9f7c?w=800',
        isAvailable: true
      },
      {
        restaurantId: chickenDelight._id,
        name: 'Coleslaw',
        description: 'Fresh cabbage coleslaw',
        price: 3.99,
        category: 'side',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true, vegan: true }
      },

      // Dragon Wok - Asian category
      {
        restaurantId: dragonWok._id,
        name: 'Kung Pao Chicken',
        description: 'Spicy stir-fried chicken with peanuts and vegetables',
        price: 13.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1552568043-0b5c02c30a48?w=800',
        isAvailable: true,
        dietaryInfo: { spicy: true }
      },
      {
        restaurantId: dragonWok._id,
        name: 'Sweet and Sour Pork',
        description: 'Crispy pork in tangy sweet and sour sauce',
        price: 12.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d8c7?w=800',
        isAvailable: true
      },
      {
        restaurantId: dragonWok._id,
        name: 'Fried Rice',
        description: 'Traditional Chinese fried rice with vegetables',
        price: 9.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      },
      {
        restaurantId: dragonWok._id,
        name: 'Spring Rolls (4 pieces)',
        description: 'Crispy vegetable spring rolls',
        price: 5.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      },
      {
        restaurantId: dragonWok._id,
        name: 'Hot and Sour Soup',
        description: 'Traditional Chinese soup with tofu and mushrooms',
        price: 6.99,
        category: 'soup',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
        isAvailable: true
      },

      // Sushi Master - Asian category
      {
        restaurantId: sushiMaster._id,
        name: 'Salmon Sushi Platter',
        description: 'Fresh salmon sushi with 12 pieces',
        price: 18.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800',
        isAvailable: true
      },
      {
        restaurantId: sushiMaster._id,
        name: 'California Roll (8 pieces)',
        description: 'Crab, avocado, and cucumber roll',
        price: 10.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        isAvailable: true
      },
      {
        restaurantId: sushiMaster._id,
        name: 'Dragon Roll',
        description: 'Eel and cucumber with avocado on top',
        price: 14.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800',
        isAvailable: true
      },
      {
        restaurantId: sushiMaster._id,
        name: 'Miso Soup',
        description: 'Traditional Japanese soup with tofu',
        price: 4.99,
        category: 'soup',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      },
      {
        restaurantId: sushiMaster._id,
        name: 'Edamame',
        description: 'Steamed soybeans with salt',
        price: 5.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true, vegan: true }
      },

      // Spice Route Indian - Indian category
      {
        restaurantId: spiceRoute._id,
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken pieces',
        price: 15.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        isAvailable: true
      },
      {
        restaurantId: spiceRoute._id,
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice with spiced chicken and herbs',
        price: 16.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d8c7?w=800',
        isAvailable: true
      },
      {
        restaurantId: spiceRoute._id,
        name: 'Vegetable Samosa (3 pieces)',
        description: 'Crispy pastry filled with spiced vegetables',
        price: 5.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true, vegan: true }
      },
      {
        restaurantId: spiceRoute._id,
        name: 'Garlic Naan',
        description: 'Fresh baked bread with garlic and herbs',
        price: 3.99,
        category: 'side',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      },
      {
        restaurantId: spiceRoute._id,
        name: 'Mango Lassi',
        description: 'Sweet yogurt drink with fresh mango',
        price: 4.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      },

      // El Fiesta Mexicana - Mexican category
      {
        restaurantId: elFiesta._id,
        name: 'Beef Tacos (3 pieces)',
        description: 'Soft tortillas filled with seasoned beef, lettuce, and cheese',
        price: 10.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1565299585323-38174c92641b?w=800',
        isAvailable: true
      },
      {
        restaurantId: elFiesta._id,
        name: 'Chicken Burrito',
        description: 'Large flour tortilla with grilled chicken, rice, beans, and salsa',
        price: 11.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800',
        isAvailable: true
      },
      {
        restaurantId: elFiesta._id,
        name: 'Quesadilla',
        description: 'Grilled tortilla with melted cheese and choice of chicken or vegetables',
        price: 8.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b0?w=800',
        isAvailable: true
      },
      {
        restaurantId: elFiesta._id,
        name: 'Guacamole & Chips',
        description: 'Fresh avocado dip with crispy tortilla chips',
        price: 6.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true, vegan: true }
      },
      {
        restaurantId: elFiesta._id,
        name: 'Horchata',
        description: 'Traditional Mexican rice drink with cinnamon',
        price: 4.49,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true, vegan: true }
      },

      // Thai Garden - Thai category
      {
        restaurantId: thaiGarden._id,
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with tamarind sauce, peanuts, and lime',
        price: 13.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      },
      {
        restaurantId: thaiGarden._id,
        name: 'Green Curry Chicken',
        description: 'Spicy green curry with chicken, coconut milk, and vegetables',
        price: 14.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1571997478779-1adc6e61910b?w=800',
        isAvailable: true,
        dietaryInfo: { spicy: true }
      },
      {
        restaurantId: thaiGarden._id,
        name: 'Tom Yum Soup',
        description: 'Hot and sour soup with shrimp, mushrooms, and lemongrass',
        price: 12.99,
        category: 'soup',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
        isAvailable: true,
        dietaryInfo: { spicy: true }
      },
      {
        restaurantId: thaiGarden._id,
        name: 'Spring Rolls (4 pieces)',
        description: 'Crispy vegetable spring rolls with sweet chili sauce',
        price: 6.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      },
      {
        restaurantId: thaiGarden._id,
        name: 'Thai Iced Tea',
        description: 'Sweetened tea with condensed milk',
        price: 4.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
        isAvailable: true,
        dietaryInfo: { vegetarian: true }
      }
    ]

    const createdMenuItems = await MenuItem.insertMany(menuItems)
    console.log(`✅ Inserted ${createdMenuItems.length} menu items`)

    // ===== DEALS =====
    const deals = [
      {
        title: '50% Off on All Pizzas',
        description: 'Get amazing 50% discount on all pizza orders. Valid on orders above $20.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        discountType: 'percentage',
        discountValue: 50,
        code: 'PIZZA50',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minOrderAmount: 20,
        maxDiscount: 25,
        applicableOn: 'specific_restaurants',
        restaurantIds: [pizzaParadise._id],
        isActive: true
      },
      {
        title: '$10 Off on Orders Above $30',
        description: 'Save $10 on your order when you spend more than $30. Perfect for family meals!',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        discountType: 'fixed',
        discountValue: 10,
        code: 'SAVE10',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        minOrderAmount: 30,
        applicableOn: 'all',
        isActive: true
      },
      {
        title: 'Buy 1 Get 1 Free - Burgers',
        description: 'Buy any burger and get another one free! Limited time offer.',
        image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800',
        discountType: 'buy_one_get_one',
        discountValue: 100,
        code: 'BOGO100',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        minOrderAmount: 15,
        applicableOn: 'specific_restaurants',
        restaurantIds: [burgerPalace._id],
        isActive: true
      },
      {
        title: 'Free Delivery on All Orders',
        description: 'Enjoy free delivery on all orders, no minimum required. Order now!',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        discountType: 'free_delivery',
        discountValue: 0,
        code: 'FREEDEL',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        minOrderAmount: 0,
        applicableOn: 'all',
        isActive: true
      },
      {
        title: '30% Off Chinese Cuisine',
        description: 'Special discount on all Chinese restaurants. Authentic flavors at great prices!',
        image: 'https://images.unsplash.com/photo-1552568043-0b5c02c30a48?w=800',
        discountType: 'percentage',
        discountValue: 30,
        code: 'CHINESE30',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        minOrderAmount: 25,
        maxDiscount: 20,
        applicableOn: 'specific_restaurants',
        restaurantIds: [dragonWok._id],
        isActive: true
      },
      {
        title: '20% Off Desserts',
        description: 'Sweeten your day with 20% off all desserts!',
        image: 'https://images.unsplash.com/photo-1563805042-7688c019e175?w=800',
        discountType: 'percentage',
        discountValue: 20,
        code: 'DESSERT20',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        minOrderAmount: 12,
        applicableOn: 'specific_restaurants',
        restaurantIds: [sweetDreams._id],
        isActive: true
      },
      {
        title: 'Chicken Special - $5 Off',
        description: 'Get $5 off on all chicken orders above $20',
        image: 'https://images.unsplash.com/photo-1626087927381-6c0f5e5e6b9f?w=800',
        discountType: 'fixed',
        discountValue: 5,
        code: 'CHICKEN5',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        minOrderAmount: 20,
        applicableOn: 'specific_restaurants',
        restaurantIds: [chickenDelight._id],
        isActive: true
      }
    ]

    const createdDeals = await Deal.insertMany(deals)
    console.log(`✅ Inserted ${createdDeals.length} deals`)

    console.log('\n🎉 Database seeded successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Restaurants: ${createdRestaurants.length}`)
    console.log(`   - Menu Items: ${createdMenuItems.length}`)
    console.log(`   - Deals: ${createdDeals.length}`)
    console.log('\n✨ You can now test the full flow from browsing to checkout!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()

