import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiUsers, FiTarget, FiTruck, FiHeart, FiAward, FiTrendingUp } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const AboutUs = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const stats = [
    { number: '1000+', label: 'Partner Restaurants', icon: FiUsers },
    { number: '50K+', label: 'Happy Customers', icon: FiHeart },
    { number: '500K+', label: 'Orders Delivered', icon: FiTruck },
    { number: '4.8/5', label: 'Average Rating', icon: FiAward },
  ]

  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description: 'To connect food lovers with the best local restaurants, making delicious meals accessible with just a few clicks. We believe everyone deserves great food delivered fast and fresh.',
    },
    {
      icon: FiHeart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We work tirelessly to ensure every order is perfect, every delivery is on time, and every experience exceeds expectations.',
    },
    {
      icon: FiTrendingUp,
      title: 'Growth & Innovation',
      description: 'We continuously evolve our platform with cutting-edge technology to provide you with the best ordering experience, faster delivery, and more restaurant choices.',
    },
  ]

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Passionate about food and technology, Alex started ZappEats with a vision to revolutionize food delivery.',
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Ensures smooth operations and exceptional customer service across all our partner restaurants.',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Technology Lead',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Leads our tech team in building innovative solutions for seamless food ordering and delivery.',
    },
    {
      name: 'Emily Thompson',
      role: 'Head of Partnerships',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Builds strong relationships with restaurants and ensures the best dining options for our users.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 dark:from-orange-600 dark:via-pink-600 dark:to-purple-600 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 opacity-10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-white mb-8 hover:text-yellow-200 transition-colors"
          >
            <FiArrowLeft className="text-xl" />
            <span className="font-semibold">Back to Home</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              About ZappEats
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              We're on a mission to make great food accessible to everyone, delivered fast and fresh to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-dark-text mb-6 text-center">
              Our Story
            </h2>
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8 md:p-12 space-y-6">
              <p className="text-lg text-gray-700 dark:text-dark-muted leading-relaxed">
                Founded in 2025, ZappEats emerged from a simple idea: why should enjoying great food from your favorite restaurants be complicated? We started with a vision to bridge the gap between food lovers and local restaurants.
              </p>
              <p className="text-lg text-gray-700 dark:text-dark-muted leading-relaxed">
                Today, we've grown into a trusted platform connecting thousands of customers with hundreds of partner restaurants. Our commitment to quality, speed, and exceptional service has made us a household name in food delivery.
              </p>
              <p className="text-lg text-gray-700 dark:text-dark-muted leading-relaxed">
                From cozy family-owned pizzerias to upscale dining establishments, we partner with restaurants that share our passion for great food and customer satisfaction. Every order is handled with care, ensuring your meal arrives fresh, hot, and exactly as you ordered it.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 text-center border border-gray-200 dark:border-dark-border"
                >
                  <Icon className="text-4xl text-orange-500 mx-auto mb-4" />
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-dark-text mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-muted">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-dark-text mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-dark-border"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-muted leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-dark-text mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-dark-border"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text mb-1">
                    {member.name}
                  </h3>
                  <p className="text-orange-500 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-dark-muted text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <h2 className="text-4xl font-bold mb-8 text-center">Why Choose ZappEats?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast Delivery</h3>
                <p className="text-white/90">Average delivery time of 30-40 minutes from order to your door.</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold mb-2">Wide Variety</h3>
                <p className="text-white/90">Over 1000+ restaurants serving cuisines from around the world.</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💳</div>
                <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                <p className="text-white/90">Multiple payment options with bank-level security and encryption.</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  )
}

export default AboutUs

