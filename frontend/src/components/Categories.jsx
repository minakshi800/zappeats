import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaPizzaSlice, 
  FaHamburger, 
  FaIceCream, 
  FaMugHot, 
  FaDrumstickBite,
  FaUtensils 
} from 'react-icons/fa'

const categories = [
  { icon: FaPizzaSlice, name: 'Pizza', color: 'from-red-500 to-orange-500', slug: 'pizza' },
  { icon: FaHamburger, name: 'Burgers', color: 'from-yellow-500 to-orange-500', slug: 'burgers' },
  { icon: FaIceCream, name: 'Desserts', color: 'from-pink-500 to-purple-500', slug: 'desserts' },
  { icon: FaMugHot, name: 'Drinks', color: 'from-blue-500 to-cyan-500', slug: 'drinks' },
  { icon: FaDrumstickBite, name: 'Chicken', color: 'from-orange-500 to-red-500', slug: 'chicken' },
  { icon: FaUtensils, name: 'Asian', color: 'from-green-500 to-emerald-500', slug: 'asian' },
]

const Categories = () => {
  const navigate = useNavigate()
  
  return (
    <section className="py-16 bg-white dark:bg-dark-bg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-dark-text px-4"
        >
          Browse Categories
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-0">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30, rotateY: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  scale: 1.05,
                }}
                onClick={() => navigate(`/category/${category.slug}`)}
                className="group cursor-pointer"
              >
                <div className="bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform-gpu border border-gray-200 dark:border-dark-border">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <Icon />
                  </motion.div>
                  <h3 className="text-center font-semibold text-gray-800 dark:text-dark-text text-sm sm:text-base md:text-lg group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Categories

