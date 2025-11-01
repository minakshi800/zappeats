# How to Get Stripe API Keys - Step by Step Guide

## Step 1: Create a Stripe Account

1. Go to **https://stripe.com**
2. Click **"Start now"** or **"Sign in"** if you already have an account
3. Sign up with your email or use Google/Apple to sign in

## Step 2: Access the Dashboard

1. After logging in, you'll be taken to the **Stripe Dashboard**
2. Make sure you're in **"Test mode"** (you'll see a toggle in the top right)
   - For testing, use **Test mode** (toggle will show "Test mode" or "Live mode")
   - For production, use **Live mode** (only after testing thoroughly)

## Step 3: Get Your API Keys

### Option A: Quick Access from Dashboard
1. In the left sidebar, click on **"Developers"**
2. Then click on **"API keys"**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### Option B: From the Top Menu
1. Click on your account icon (top right)
2. Select **"Developers"** from the dropdown
3. Click **"API keys"** in the left menu

## Step 4: Copy Your Keys

### For Backend (.env file):
1. Find the **"Secret key"** (it's hidden - click "Reveal" to show it)
2. Click **"Reveal test key"** or **"Reveal live key"**
3. Copy the key (it looks like: `sk_test_51AbCdEf...` or `sk_live_...`)
4. Add it to your `backend/.env` file:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_actual_key_here
   ```

### For Frontend (.env file):
1. Find the **"Publishable key"** (it's visible, starts with `pk_test_` or `pk_live_`)
2. Copy the key (it looks like: `pk_test_51AbCdEf...` or `pk_live_...`)
3. Create `frontend/.env` file (if it doesn't exist) and add:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

## Step 5: Verify Your Keys

- **Publishable key**: Starts with `pk_test_` (test mode) or `pk_live_` (live mode)
- **Secret key**: Starts with `sk_test_` (test mode) or `sk_live_` (live mode)

⚠️ **Important Security Notes:**
- **Never share your Secret key** - it should only be in your backend `.env` file
- **Never commit `.env` files** to Git (they should be in `.gitignore`)
- The Publishable key can be shared (it's safe for frontend code)
- Test keys start with `test` - use these for development
- Live keys start with `live` - use these only in production

## Step 6: Restart Your Servers

After adding the keys:

1. **Backend**: Stop and restart your backend server
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend**: Stop and restart your frontend server
   ```bash
   cd frontend
   npm run dev
   ```

## Test Mode vs Live Mode

### Test Mode (Recommended for Development)
- Toggle is in the top right of Stripe Dashboard
- Use **Test keys** (`pk_test_`, `sk_test_`)
- No real money is processed
- Use test card numbers (see below)

### Live Mode (For Production)
- Switch toggle to "Live mode"
- Get **Live keys** (`pk_live_`, `sk_live_`)
- Processes real payments
- Only switch after thorough testing

## Test Card Numbers (For Test Mode Only)

Once you have test keys, use these cards to test:

### ✅ Successful Payment:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

### ❌ Declined Payment:
- **Card Number**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

### 🔒 Requires Authentication (3D Secure):
- **Card Number**: `4000 0025 0000 3155`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

## Troubleshooting

### "Payment system not ready"
- Check if `STRIPE_SECRET_KEY` is set in `backend/.env`
- Check if `VITE_STRIPE_PUBLISHABLE_KEY` is set in `frontend/.env`
- Restart both servers after adding keys

### "Invalid API Key"
- Make sure you copied the full key (no spaces)
- Verify you're using test keys for test mode
- Check for typos in the `.env` file

### Keys not working
- Make sure you're using keys from the correct mode (test vs live)
- Verify the `.env` files are in the correct directories
- Restart servers after adding/changing keys

## Need Help?

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **API Reference**: https://stripe.com/docs/api

## Quick Reference

**Files to create/edit:**
```
backend/.env              → Add STRIPE_SECRET_KEY=sk_test_...
frontend/.env             → Add VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Dashboard Location:**
- Developers → API keys

**Keys to look for:**
- Publishable key (frontend) - visible
- Secret key (backend) - click "Reveal" to see

