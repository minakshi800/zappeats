import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl max-w-md w-full p-8 relative border border-gray-200 dark:border-dark-border"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-dark-text transition-colors"
          >
            <FiX className="text-2xl" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                type === 'danger'
                  ? 'bg-red-100'
                  : type === 'warning'
                  ? 'bg-orange-100'
                  : 'bg-blue-100'
              }`}
            >
              <FiAlertTriangle
                className={`text-4xl ${
                  type === 'danger'
                    ? 'text-red-500'
                    : type === 'warning'
                    ? 'text-orange-500'
                    : 'text-blue-500'
                }`}
              />
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text text-center mb-4">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-dark-muted text-center mb-8 leading-relaxed">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-darker transition-colors"
            >
              {cancelText}
            </motion.button>
            <motion.button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-shadow ${
                type === 'danger'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'
                  : type === 'warning'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg'
              }`}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ConfirmModal

