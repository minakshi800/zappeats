import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className="relative w-14 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 p-1 shadow-lg hover:shadow-xl transition-all"
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center ${
          isDark ? 'left-1' : 'left-7'
        }`}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <FiMoon className="text-orange-500 text-sm" />
          ) : (
            <FiSun className="text-yellow-500 text-sm" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle

