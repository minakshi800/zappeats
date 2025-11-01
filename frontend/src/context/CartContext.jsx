/* @refresh reset */
import { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage synchronously to prevent empty state on refresh
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          return Array.isArray(parsed) ? parsed : []
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
          return []
        }
      }
    }
    return []
  })

  // Save cart to localStorage whenever cart changes (but not on initial mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        )
      }
      return [...prevItems, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
  }

  const getDealDiscount = () => {
    let totalDiscount = 0
    const itemsWithDeals = cartItems.filter(item => item.dealId && item.dealType && item.dealDiscount)
    
    itemsWithDeals.forEach(item => {
      const itemTotal = (item.price || 0) * (item.quantity || 1)
      if (item.dealType === 'percentage') {
        const discount = itemTotal * (item.dealDiscount / 100)
        totalDiscount += discount
      } else if (item.dealType === 'fixed') {
        const discount = Math.min(item.dealDiscount, itemTotal)
        totalDiscount += discount
      } else if (item.dealType === 'buy_one_get_one') {
        // For BOGO, apply discount to half the items (get one free)
        const quantity = item.quantity || 1
        const freeItems = Math.floor(quantity / 2)
        const discount = (item.price || 0) * freeItems
        totalDiscount += discount
      }
    })
    
    return totalDiscount
  }

  const getCartTotalAfterDeals = () => {
    const subtotal = getCartTotal()
    const dealDiscount = getDealDiscount()
    return Math.max(0, subtotal - dealDiscount)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getDealDiscount,
    getCartTotalAfterDeals,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

