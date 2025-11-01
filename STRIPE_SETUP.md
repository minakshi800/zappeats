# Stripe Payment Gateway Setup Guide

## Overview
Stripe payment gateway has been integrated into ZappEats. This document explains how to set up and use it.

## Prerequisites
1. Create a Stripe account at https://stripe.com
2. Get your API keys from Stripe Dashboard

## Environment Variables

### Backend (.env)
Add the following to your `backend/.env` file:

```env
STRIPE_SECRET_KEY=sk_test_... (Your Stripe Secret Key)
STRIPE_WEBHOOK_SECRET=whsec_... (Webhook signing secret - for production)
```

### Frontend (.env)
Create a `frontend/.env` file and add:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (Your Stripe Publishable Key)
```

## Getting Your Stripe Keys

1. **Login to Stripe Dashboard**: https://dashboard.stripe.com
2. **Get Test Keys** (for development):
   - Go to Developers → API keys
   - Copy "Publishable key" → Add to `VITE_STRIPE_PUBLISHABLE_KEY` in frontend `.env`
   - Copy "Secret key" → Add to `STRIPE_SECRET_KEY` in backend `.env`

3. **Get Webhook Secret** (for production):
   - Go to Developers → Webhooks
   - Create endpoint: `https://your-domain.com/api/payments/webhook`
   - Copy "Signing secret" → Add to `STRIPE_WEBHOOK_SECRET` in backend `.env`

## Testing Payments

### Test Card Numbers (Stripe Test Mode)
Use these test cards to test payments:

**Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)

**Declined Payment:**
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

**Requires Authentication (3D Secure):**
- Card Number: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits

## How It Works

1. **Payment Intent Creation**: When user selects "Card" payment, frontend creates a payment intent on backend
2. **Stripe Elements**: Card details are entered using Stripe's secure card element
3. **Payment Confirmation**: On order submit, payment is confirmed with Stripe
4. **Order Creation**: If payment succeeds, order is created in database
5. **Webhook Handling**: Stripe sends webhooks to update order status (for production)

## Payment Flow

1. User fills checkout form
2. If "Card" payment:
   - Payment intent is created automatically
   - User enters card details in Stripe Elements
   - On submit, payment is processed via Stripe
   - Order is created only if payment succeeds
3. If "Cash on Delivery":
   - Order is created directly
   - Payment status set to "pending"

## Security Features

- ✅ Card details never touch your server (PCI compliant)
- ✅ Payment processing handled by Stripe
- ✅ Webhook signature verification for production
- ✅ Payment intent confirmation before order creation

## Production Deployment

1. Switch to live Stripe keys (from Stripe Dashboard → Live mode)
2. Update environment variables with live keys
3. Set up webhook endpoint in Stripe Dashboard
4. Add webhook signing secret to backend `.env`
5. Test webhook delivery in Stripe Dashboard

## Troubleshooting

- **"Payment system not ready"**: Check if Stripe keys are set in `.env` files
- **Payment fails**: Check Stripe Dashboard → Logs for error details
- **Webhook not working**: Verify webhook URL and signing secret

## Support

For Stripe-related issues, check:
- Stripe Documentation: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api

