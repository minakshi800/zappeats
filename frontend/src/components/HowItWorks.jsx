import { motion } from 'framer-motion'
import { FiShoppingBag, FiCheckCircle, FiTruck } from 'react-icons/fi'

const steps = [
  {
    icon: FiShoppingBag,
    number: '1',
    title: 'Choose Your Food',
    description: 'Browse through our extensive menu and select your favorite dishes from top restaurants.'
  },
  {
    icon: FiCheckCircle,
    number: '2',
    title: 'Place Your Order',
    description: 'Add items to your cart, customize your order, and proceed to checkout securely.'
  },
  {
    icon: FiTruck,
    number: '3',
    title: 'Fast Delivery',
    description: 'Track your order in real-time as our delivery partner brings it to your doorstep.'
  },
]

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-darker dark:to-dark-bg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-gray-800 dark:text-dark-text px-4"
        >
          How It Works
        </motion.h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                }}
                className="relative bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform-gpu border border-gray-200 dark:border-dark-border"
              >
                {/* Animated Background Circle */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                />

                <div className="relative z-10">
                  {/* Step Number with 3D effect */}
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                  >
                    {step.number}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="inline-block mb-6"
                  >
                    <Icon className="text-5xl text-orange-500" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-dark-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Line (for visual flow) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-orange-400 to-transparent" />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

