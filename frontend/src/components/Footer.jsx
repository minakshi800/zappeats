import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'

const Footer = () => {
  const socialLinks = [
    { icon: FaFacebook, href: '#' },
    { icon: FaTwitter, href: '#' },
    { icon: FaInstagram, href: '#' },
    { icon: FaLinkedin, href: '#' },
  ]

  return (
    <footer className="bg-gray-900 dark:bg-dark-darker text-white pt-16 pb-8 border-t border-gray-800 dark:border-dark-border transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              🍕 ZappEats
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Delivering delicious food to your doorstep since 2025. We partner with the best restaurants to bring you amazing dining experiences.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gray-800 dark:bg-dark-card rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 transition-all border border-gray-700 dark:border-dark-border"
                  >
                    <Icon />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4 relative pb-2">
              Quick Links
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500"></span>
            </h3>
            <ul className="space-y-3">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Link to="/about-us" className="text-gray-400 hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Link to="/restaurants" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Restaurants
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Link to="/deals" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Deals
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <a href="#contact" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Contact
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4 relative pb-2">
              Contact Us
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin className="text-orange-400 mt-1" />
                <span>123 Food Street, New York</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="text-orange-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMail className="text-orange-400" />
                <span>support@zappeats.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-dark-border pt-8 text-center">
          <p className="text-gray-400 dark:text-dark-muted">
            &copy; 2025 ZappEats. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

