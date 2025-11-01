import stripe from '../config/stripe.js'
import Order from '../models/Order.js'

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please add STRIPE_SECRET_KEY to backend/.env. Get your key from: https://dashboard.stripe.com/test/apikeys'
      })
    }

    const { amount, currency = 'usd', metadata = {} } = req.body

    if (!amount || amount < 0.5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum amount is $0.50'
      })
    }

    // Convert amount to cents (Stripe requires amount in smallest currency unit)
    const amountInCents = Math.round(amount * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      metadata: {
        userId: req.userId.toString(),
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    })
  }
}

// @desc    Create order with payment
// @route   POST /api/payments/create-order
// @access  Private
export const createOrderWithPayment = async (req, res) => {
  try {
    const { 
      items, 
      subtotal, 
      deliveryFee, 
      tax, 
      total, 
      deliveryAddress, 
      paymentMethod,
      paymentIntentId,
      couponCode,
      couponDiscount,
      dealDiscount,
      totalDiscount
    } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item'
      })
    }

    if (!deliveryAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide delivery address and payment method'
      })
    }

    // If payment method is card, verify payment intent
    let paymentStatus = 'pending'
    if (paymentMethod === 'card' && paymentIntentId) {
      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({
          success: false,
          message: 'Payment service is not configured. Cash on delivery is still available. Please add STRIPE_SECRET_KEY to backend/.env for card payments.'
        })
      }
      
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        
        if (paymentIntent.status === 'succeeded') {
          paymentStatus = 'paid'
        } else if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'canceled') {
          return res.status(400).json({
            success: false,
            message: 'Payment was not successful. Please try again.'
          })
        }
      } catch (error) {
        console.error('Payment intent verification error:', error)
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        })
      }
    }

    const order = await Order.create({
      userId: req.userId,
      items,
      subtotal,
      deliveryFee: deliveryFee || 2.99,
      tax: tax || 0,
      total,
      deliveryAddress,
      paymentMethod,
      paymentStatus,
      paymentIntentId: paymentIntentId || null,
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || 0,
      dealDiscount: dealDiscount || 0,
      totalDiscount: totalDiscount || 0
    })

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    })
  } catch (error) {
    console.error('Create order with payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Verify payment and update order
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      // Update order if orderId is provided
      if (orderId) {
        const order = await Order.findById(orderId)
        if (order && order.userId.toString() === req.userId) {
          order.paymentStatus = 'paid'
          await order.save()
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentStatus: 'paid'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        paymentStatus: paymentIntent.status
      })
    }
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    })
  }
}

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public (Stripe signature verification required)
export const handleWebhook = async (req, res) => {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Stripe is not configured. Webhook cannot be processed.')
    return res.status(503).json({ error: 'Payment service not configured' })
  }

  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      
      // Update order payment status if order exists
      if (paymentIntent.metadata.orderId) {
        try {
          const order = await Order.findById(paymentIntent.metadata.orderId)
          if (order) {
            order.paymentStatus = 'paid'
            await order.save()
          }
        } catch (error) {
          console.error('Error updating order from webhook:', error)
        }
      }
      break
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log('PaymentIntent failed:', failedPayment.id)
      break
    
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
}

