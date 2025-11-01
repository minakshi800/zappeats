# How to Test Stripe Payments in ZappEats

## Prerequisites
✅ Make sure both servers are running:
- Backend: `cd backend && npm run dev` (should be on port 5000)
- Frontend: `cd frontend && npm run dev` (should be on port 3000 or 5173)

## Step-by-Step Testing Guide

### Step 1: Start Your App
1. **Open your browser** and go to: `http://localhost:3000` (or the port your frontend is using)
2. Make sure you're **signed in** to your account
3. If you don't have an account, create one or sign in

### Step 2: Add Items to Cart
1. Navigate to the **homepage**
2. Click the **"+"** button on any dish in "Popular Dishes" section
   - OR go to **Restaurants** page
   - Select a restaurant
   - Click on a menu item to add to cart
   - OR search for food using the search bar on homepage

3. Verify items are added:
   - Check the cart icon in the header (should show item count)
   - Click the cart icon to view your cart

### Step 3: Go to Checkout
1. Click **"Proceed to Checkout"** or go to Cart page and click **"Proceed to Checkout"**
2. You should see the checkout page with:
   - Delivery information form
   - Payment method selection
   - Order summary

### Step 4: Fill Delivery Information
Fill in the required fields:
- **Full Name**: Your name
- **Email**: Your email
- **Phone**: Your phone number
- **Address**: Street address
- **City**: Your city
- **Zip Code**: Your zip code
- **Delivery Instructions** (optional)

### Step 5: Test Card Payment

#### Option A: Successful Payment ✅
1. Select **"Credit/Debit Card"** as payment method
2. Wait for the Stripe card input to load (should show "Card Details" field)
3. Enter these test card details:
   - **Card Number**: `4242 4242 4242 4242`
   - **Cardholder Name**: Any name (e.g., "John Doe")
   - **Expiry Date**: Any future date (e.g., `12/34`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **ZIP**: Any 5 digits (e.g., `12345`)

4. Click **"Place Order"**
5. **Expected Result**: 
   - Payment processes successfully
   - You're redirected to "Order Success" page
   - Order appears in "My Orders" section of Profile page

#### Option B: Declined Payment ❌
To test a failed payment:
- **Card Number**: `4000 0000 0000 0002`
- Use same expiry, CVC, and ZIP as above
- **Expected Result**: Error message showing payment was declined

#### Option C: Requires 3D Secure (Authentication) 🔒
- **Card Number**: `4000 0025 0000 3155`
- Use same expiry, CVC, and ZIP
- **Expected Result**: May require additional authentication step

### Step 6: Test Cash on Delivery
1. Select **"Cash on Delivery"** as payment method
2. Fill in delivery information
3. Click **"Place Order"**
4. **Expected Result**:
   - Order is created successfully
   - Payment status will be "pending"
   - You're redirected to "Order Success" page

### Step 7: Verify Order
1. Go to **Profile** page
2. Click on **"My Orders"** tab
3. You should see your order(s) listed with:
   - Order number
   - Order date
   - Status (pending, confirmed, etc.)
   - Total amount
   - Items in the order

## Test Scenarios Checklist

### ✅ Successful Scenarios
- [ ] Add items to cart
- [ ] Checkout with card payment (success)
- [ ] Checkout with cash on delivery
- [ ] Order appears in "My Orders"
- [ ] Order details are correct

### ❌ Error Scenarios
- [ ] Declined card payment shows error
- [ ] Empty cart prevents checkout
- [ ] Missing required fields shows validation errors
- [ ] Invalid card number shows error

## Troubleshooting

### "Payment system not ready"
- Check if `STRIPE_SECRET_KEY` is in `backend/.env`
- Check if `VITE_STRIPE_PUBLISHABLE_KEY` is in `frontend/.env`
- Restart both servers

### "Invalid API Key"
- Verify the key in your `.env` file matches Stripe dashboard
- Ensure no extra spaces before/after the key
- Make sure you're using test keys (start with `sk_test_` and `pk_test_`)

### Card input not showing
- Check browser console for errors
- Verify Stripe publishable key is set
- Check network tab for API errors

### Payment processes but order not created
- Check backend server logs for errors
- Verify MongoDB connection
- Check if user is authenticated

## Test Cards Reference

| Scenario | Card Number | Expected Result |
|----------|------------|-----------------|
| Success | `4242 4242 4242 4242` | ✅ Payment succeeds |
| Decline | `4000 0000 0000 0002` | ❌ Payment declined |
| 3D Secure | `4000 0025 0000 3155` | 🔒 Requires authentication |
| Insufficient Funds | `4000 0000 0000 9995` | ❌ Insufficient funds |

**Note**: Use any future expiry date (e.g., `12/34`) and any 3-digit CVC (e.g., `123`)

## What to Look For

### ✅ Success Indicators:
- No errors in browser console
- Payment intent created successfully (check backend logs)
- Order created in database
- Success page appears
- Order visible in "My Orders"

### ❌ Error Indicators:
- Red error messages in UI
- Errors in browser console
- Errors in backend server logs
- Payment fails or times out

## Additional Testing

### Test Multiple Items:
1. Add several items from different restaurants
2. Verify cart totals are correct
3. Proceed to checkout
4. Verify order includes all items

### Test Order History:
1. Place multiple orders
2. Check "My Orders" shows all orders
3. Verify order details are correct
4. Check order status is correct

### Test Responsive Design:
1. Test checkout on mobile view
2. Verify forms are usable
3. Check Stripe card input is visible
4. Test payment on different screen sizes

