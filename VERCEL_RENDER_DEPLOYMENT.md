# 🚀 ZappEats - Deployment Guide: Vercel (Frontend) + Render (Backend)

## Overview
This guide will help you deploy:
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Express.js + Node.js)

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account (free)
- [ ] Vercel account (free tier available)
- [ ] Render account (free tier available)
- [ ] Stripe account (for payments)
- [ ] MongoDB Atlas account (already set up ✅)

---

## Step 1: Prepare Your Code for GitHub

### 1.1 Initialize Git (if not already done)

```powershell
# In your project root (C:\ZappEats)
git init
git add .
git commit -m "Ready for deployment"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `zappeats` (or any name you like)
3. **Don't** initialize with README, .gitignore, or license
4. Click "Create repository"

### 1.3 Push Code to GitHub

```powershell
# In your project root
git remote add origin https://github.com/YOUR_USERNAME/zappeats.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Prepare Environment Variables

### 2.1 Generate Strong JWT Secret

```powershell
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copy the output** - you'll need it later.

### 2.2 Get Stripe Keys

1. Go to https://dashboard.stripe.com
2. **For testing**: Stay in Test mode
3. **For production**: Switch to Live mode
4. Go to **Developers → API keys**
5. Copy:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (click "Reveal" - starts with `sk_test_` or `sk_live_`)

**Note**: Start with test keys, then switch to live keys for production.

---

## Step 3: Deploy Backend on Render

### 3.1 Create Render Account

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your GitHub

### 3.2 Create New Web Service

1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository (`zappeats`)
4. Click **"Connect"**

### 3.3 Configure Backend Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `zappeats-backend` (or any name you like)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
Click **"Add Environment Variable"** and add these one by one:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_generated_jwt_secret_here
FRONTEND_URL=https://your-frontend-domain.vercel.app
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret (optional for now)
```

**Important Notes:**
- Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas URI
- Replace `your_generated_jwt_secret_here` with the JWT secret you generated
- Replace `your-frontend-domain.vercel.app` with a placeholder for now (we'll update after frontend deployment)
- For `FRONTEND_URL`, you can use a placeholder like `https://placeholder.vercel.app` for now

### 3.4 Create Service

1. Scroll down and click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Wait for deployment to complete (usually 3-5 minutes)
4. Render will give you a URL like: `https://zappeats-backend.onrender.com`
5. **Copy this URL** - this is your backend API URL

### 3.5 Test Backend

1. Open the Render URL in browser: `https://zappeats-backend.onrender.com`
2. You should see: `{"message":"ZappEats API Server is running"}`
3. Test API endpoint: `https://zappeats-backend.onrender.com/api/restaurants`
4. Should return restaurants data (JSON)

**Note**: On Render's free tier, the service may "spin down" after 15 minutes of inactivity. The first request after spin-down may take 30-50 seconds to respond.

---

## Step 4: Deploy Frontend on Vercel

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub (easiest option)
4. Authorize Vercel to access your GitHub

### 4.2 Import Project

1. In Vercel dashboard, click **"Add New Project"**
2. Select your `zappeats` repository
3. Click **"Import"**

### 4.3 Configure Frontend

**Project Settings:**
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `frontend` (click "Edit" and set this)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

**Environment Variables:**
Click **"Environment Variables"** and add:

```
VITE_API_URL=https://zappeats-backend.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**Important:**
- Replace `zappeats-backend.onrender.com` with your actual Render backend URL from Step 3.4
- Replace `pk_test_your_stripe_publishable_key` with your actual Stripe publishable key

### 4.4 Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (usually 1-2 minutes)
3. Vercel will give you a URL like: `https://zappeats.vercel.app`
4. **Copy this URL** - this is your frontend URL

### 4.5 Update Backend CORS

1. Go back to Render dashboard
2. Go to your backend service → **Environment** tab
3. Find `FRONTEND_URL` variable
4. Click **"Edit"** and update it to your actual Vercel URL:
   ```
   FRONTEND_URL=https://zappeats.vercel.app
   ```
5. Replace with your actual Vercel URL
6. Click **"Save Changes"**
7. Render will automatically redeploy

---

## Step 5: Configure Stripe Webhook (Optional but Recommended)

### 5.1 Set Up Webhook in Stripe

1. Go to Stripe Dashboard → **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://zappeats-backend.onrender.com/api/payments/webhook`
   - Replace with your actual Render backend URL
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)

### 5.2 Add Webhook Secret to Render

1. Go to Render → Your backend service → **Environment** tab
2. Click **"Add Environment Variable"**
3. Add:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```
4. Replace with your actual webhook secret
5. Click **"Save Changes"**
6. Render will redeploy automatically

---

## Step 6: Update MongoDB Atlas IP Whitelist

### 6.1 Allow Render IPs

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. For Render, you have two options:

   **Option A (Easier but less secure):**
   - Add `0.0.0.0/0` (allows all IPs)
   - Click **"Confirm"**
   
   **Option B (More secure):**
   - Check Render's documentation for their IP ranges
   - Add specific IP ranges
   - This is more secure but requires maintenance

**Note**: For development/testing, Option A is fine. For production, consider Option B.

---

## Step 7: Test Your Deployment

### 7.1 Test Frontend

1. Open your Vercel URL: `https://zappeats.vercel.app`
2. Test these features:
   - [ ] Homepage loads correctly
   - [ ] Can browse restaurants
   - [ ] Can sign up for new account
   - [ ] Can login
   - [ ] Can add items to cart
   - [ ] Can proceed to checkout
   - [ ] Payment works (use test card: `4242 4242 4242 4242`)

### 7.2 Test Backend API

1. Test these endpoints in browser or Postman:
   - `https://zappeats-backend.onrender.com/api/restaurants`
   - `https://zappeats-backend.onrender.com/api/deals`
   - `https://zappeats-backend.onrender.com/api/coupons`

### 7.3 Common Issues & Solutions

**Issue: CORS Error**
- **Solution**: Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check for trailing slashes (should be no trailing slash)
- Verify the variable is saved correctly

**Issue: API Not Working / 502 Error**
- **Solution**: 
  - Check Render logs (go to your service → Logs tab)
  - Verify environment variables are set correctly
  - Check MongoDB connection
  - On free tier, wait 30-50 seconds for first request (service may be spinning up)

**Issue: Images Not Loading**
- **Solution**: Images should work (they're from Unsplash)
- Check browser console for errors
- Verify API is responding

**Issue: Payment Not Working**
- **Solution**:
  - Verify Stripe keys are correct in both Vercel and Render
  - Check if using test keys (for testing) or live keys (for production)
  - Check Stripe dashboard for errors
  - Verify webhook is set up correctly

---

## Step 8: Keep Services Awake (Render Free Tier)

### 8.1 The Problem

On Render's free tier, your backend service will "spin down" after 15 minutes of inactivity. The first request after spin-down takes 30-50 seconds to respond.

### 8.2 Solutions

**Option 1: Use Uptime Monitoring (Free)**
- Use services like:
  - https://uptimerobot.com (free)
  - https://cron-job.org (free)
- Set up a cron job to ping your backend every 10-14 minutes
- URL to ping: `https://zappeats-backend.onrender.com`

**Option 2: Upgrade to Paid Plan**
- Render's paid plans ($7/month) keep services always running
- No spin-down delays

**Option 3: Accept the Delay**
- For testing/demos, the 30-50 second delay is acceptable
- Users will experience it on first request after inactivity

---

## Step 9: Custom Domain (Optional)

### 9.1 Frontend Custom Domain (Vercel)

1. Go to Vercel → Your project → **Settings** → **Domains**
2. Enter your custom domain (e.g., `zappeats.com`)
3. Follow Vercel's instructions to configure DNS
4. Update `FRONTEND_URL` in Render with your new domain

### 9.2 Backend Custom Domain (Render)

1. Go to Render → Your service → **Settings** → **Custom Domain**
2. Add your custom domain
3. Follow Render's instructions to configure DNS
4. Update `VITE_API_URL` in Vercel with your new backend domain

---

## 📝 Quick Reference

### Backend URL (Render)
```
https://zappeats-backend.onrender.com
```

### Frontend URL (Vercel)
```
https://zappeats.vercel.app
```

### Environment Variables Checklist

**Backend (Render):**
- [x] NODE_ENV=production
- [x] PORT=10000 (Render uses port 10000)
- [x] MONGODB_URI=...
- [x] JWT_SECRET=...
- [x] FRONTEND_URL=...
- [x] STRIPE_SECRET_KEY=...
- [x] STRIPE_WEBHOOK_SECRET=... (optional)

**Frontend (Vercel):**
- [x] VITE_API_URL=...
- [x] VITE_STRIPE_PUBLISHABLE_KEY=...

---

## 🆘 Troubleshooting

### Deployment Fails

**Backend (Render):**
- Check Render logs (service → Logs tab)
- Verify `package.json` has `start` script
- Check Node version (should be 18+)
- Verify root directory is set to `backend`

**Frontend (Vercel):**
- Check Vercel build logs
- Verify `vite.config.js` is correct
- Check for build errors in logs
- Verify root directory is set to `frontend`

### API Not Connecting

- Verify `VITE_API_URL` in Vercel matches Render URL exactly
- Check CORS settings in backend
- Verify backend is running (check Render logs)
- On free tier, wait 30-50 seconds for first request

### Payment Not Working

- Verify Stripe keys are correct in both platforms
- Check if using test keys (for testing) or live keys (for production)
- Check Stripe dashboard for errors
- Verify webhook is set up correctly

### Slow First Request (Render Free Tier)

- This is normal on free tier (service spins down after 15 min)
- First request after spin-down takes 30-50 seconds
- Use uptime monitoring to keep service awake (see Step 8)

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads correctly on Vercel
- [ ] Backend API responds on Render
- [ ] User registration works
- [ ] User login works
- [ ] Can browse restaurants
- [ ] Can add items to cart
- [ ] Checkout works
- [ ] Payment processing works (test with `4242 4242 4242 4242`)
- [ ] Orders are saved to database
- [ ] Order history works
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] CORS is configured correctly

---

## 🎉 Congratulations!

Your ZappEats app is now live on:
- **Frontend**: Vercel
- **Backend**: Render

Share your Vercel URL with others!

**Need Help?**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs

---

## 💡 Pro Tips

1. **Monitor Your Services**: Check Render and Vercel dashboards regularly
2. **Check Logs**: Both platforms provide detailed logs for debugging
3. **Test Regularly**: Test all features after deployment
4. **Keep Services Awake**: Use uptime monitoring for Render free tier
5. **Backup Environment Variables**: Keep a secure copy of all env vars

---

## 🔄 Updating Your App

After making changes:

1. **Push to GitHub**:
   ```powershell
   git add .
   git commit -m "Your update message"
   git push
   ```

2. **Automatic Deployment**:
   - Vercel and Render will automatically detect changes
   - They will rebuild and redeploy automatically
   - Usually takes 1-3 minutes

3. **Manual Redeploy** (if needed):
   - **Vercel**: Go to Deployments → Click "Redeploy"
   - **Render**: Go to your service → Click "Manual Deploy"

---

Good luck with your deployment! 🚀


