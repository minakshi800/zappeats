import { motion } from 'framer-motion'
import { FiStar, FiPlus } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'

const dishes = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: '$12.99',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Cheeseburger',
    price: '$9.99',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce.',
    rating: 4.6,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Sushi Platter',
    price: '$18.99',
    description: 'Assorted sushi with salmon, tuna, and California rolls.',
    rating: 4.9,
    reviews: 75,
    image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
]

const PopularDishes = () => {
  const { addToCart } = useCart()

  const handleAddToCart = (dish) => {
    // Extract price from string format "$12.99" to number 12.99
    const price = parseFloat(dish.price.replace('$', ''))
    
    addToCart({
      id: `popular-${dish.id}`, // Unique ID with prefix
      name: dish.name,
      price: price,
      image: dish.image,
      restaurantId: null, // Popular dishes might not have a restaurant
      restaurantName: 'Popular Item'
    })
    
    toast.success(`${dish.name} added to cart!`)
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-dark-darker transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-dark-text px-4"
        >
          Popular Dishes
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-0">
          {dishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                scale: 1.02,
              }}
              className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform-gpu border border-gray-200 dark:border-dark-border"
            >
              {/* Image with 3D effect */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Dish Info */}
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-dark-text group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors flex-1">
                    {dish.name}
                  </h3>
                  <span className="text-lg sm:text-xl font-bold text-orange-500 dark:text-orange-400 flex-shrink-0">{dish.price}</span>
                </div>

                <p className="text-gray-600 dark:text-dark-muted text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                  {dish.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex items-center text-yellow-400">
                      <FiStar className="fill-current text-sm sm:text-base" />
                      <span className="ml-1 font-semibold text-gray-800 dark:text-dark-text text-sm sm:text-base">{dish.rating}</span>
                    </div>
                    <span className="text-gray-500 dark:text-dark-muted text-xs sm:text-sm">({dish.reviews})</span>
                  </div>

                  <motion.button
                    onClick={() => handleAddToCart(dish)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    aria-label={`Add ${dish.name} to cart`}
                  >
                    <FiPlus className="text-xl" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularDishes

