# 🚀 ZappEats - Step-by-Step Deployment Guide

## Overview
This guide will help you deploy your ZappEats app to production. We'll use:
- **Backend**: Railway (recommended) or Render
- **Frontend**: Vercel (recommended) or Netlify

---

## 📋 Pre-Deployment Checklist

Before starting, make sure you have:
- [ ] GitHub account (free)
- [ ] Railway account (free tier available) OR Render account
- [ ] Vercel account (free tier available) OR Netlify account
- [ ] Stripe account (for payments)
- [ ] MongoDB Atlas account (already set up ✅)

---

## Step 1: Prepare Your Code for GitHub

### 1.1 Initialize Git (if not already done)

```powershell
# In your project root (C:\ZappEats)
git init
git add .
git commit -m "Initial commit - ready for deployment"
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

### 2.2 Get Stripe Live Keys

1. Go to https://dashboard.stripe.com
2. **Switch to Live mode** (toggle in top right)
3. Go to **Developers → API keys**
4. Copy:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (click "Reveal" - starts with `sk_live_`)

**Note**: For initial testing, you can use test keys first, then switch to live keys later.

---

## Step 3: Deploy Backend (Railway - Recommended)

### 3.1 Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (easiest option)
3. Authorize Railway to access your GitHub

### 3.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `zappeats` repository
4. Railway will detect it's a Node.js project

### 3.3 Configure Backend Service

1. Railway will create a service automatically
2. Click on the service
3. Go to **Settings** tab
4. Set **Root Directory** to: `backend`
5. Set **Start Command** to: `npm start`

### 3.4 Add Environment Variables

1. Go to **Variables** tab
2. Click **"New Variable"**
3. Add these variables one by one:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_generated_jwt_secret_here
FRONTEND_URL=https://your-frontend-domain.vercel.app
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret (optional for now)
```

**Important Notes:**
- Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas URI
- Replace `your_generated_jwt_secret_here` with the JWT secret you generated
- Replace `your-frontend-domain.vercel.app` with your actual frontend URL (we'll get this in Step 4)
- For now, you can leave `FRONTEND_URL` empty or use a placeholder, we'll update it after frontend deployment

### 3.5 Deploy Backend

1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** button
3. Wait for deployment to complete
4. Railway will give you a URL like: `https://zappeats-production.up.railway.app`
5. **Copy this URL** - this is your backend API URL

### 3.6 Test Backend

1. Open the Railway URL in browser
2. You should see: `{"message":"ZappEats API Server is running"}`
3. Test API: `https://your-railway-url.up.railway.app/api/restaurants`
4. Should return restaurants data

---

## Step 4: Deploy Frontend (Vercel - Recommended)

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (easiest option)
3. Authorize Vercel to access your GitHub

### 4.2 Import Project

1. Click **"Add New Project"**
2. Select your `zappeats` repository
3. Click **"Import"**

### 4.3 Configure Frontend

1. **Framework Preset**: Vite (should auto-detect)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4.4 Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-railway-url.up.railway.app/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

**Important:**
- Replace `your-railway-url.up.railway.app` with your actual Railway backend URL from Step 3.5

### 4.5 Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (usually 1-2 minutes)
3. Vercel will give you a URL like: `https://zappeats.vercel.app`
4. **Copy this URL** - this is your frontend URL

### 4.6 Update Backend CORS

1. Go back to Railway
2. Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://zappeats.vercel.app
   ```
3. Replace with your actual Vercel URL
4. Railway will automatically redeploy

---

## Step 5: Configure Stripe Webhook (Optional but Recommended)

### 5.1 Set Up Webhook in Stripe

1. Go to Stripe Dashboard → **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://your-railway-url.up.railway.app/api/payments/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)

### 5.2 Add Webhook Secret to Railway

1. Go to Railway → Your backend service → Variables
2. Add new variable:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```
3. Railway will redeploy automatically

---

## Step 6: Update MongoDB Atlas IP Whitelist

### 6.1 Get Railway IP Address

1. Railway uses dynamic IPs, so you need to allow all IPs OR
2. Check Railway documentation for their IP ranges
3. For now, you can temporarily keep `0.0.0.0/0` but it's less secure

### 6.2 Update MongoDB Atlas

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. For Railway, you may need to add: `0.0.0.0/0` (allows all IPs)
   - **Note**: This is less secure but works for Railway
   - For better security, check Railway's documentation for their IP ranges

---

## Step 7: Test Your Deployment

### 7.1 Test Frontend

1. Open your Vercel URL: `https://zappeats.vercel.app`
2. Test these features:
   - [ ] Homepage loads
   - [ ] Can browse restaurants
   - [ ] Can sign up/login
   - [ ] Can add items to cart
   - [ ] Can checkout
   - [ ] Payment works (use test card: `4242 4242 4242 4242`)

### 7.2 Test Backend API

1. Test endpoints:
   - `https://your-railway-url/api/restaurants`
   - `https://your-railway-url/api/deals`
   - `https://your-railway-url/api/coupons`

### 7.3 Common Issues

**CORS Error:**
- Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Check for trailing slashes

**API Not Working:**
- Check Railway logs for errors
- Verify environment variables are set correctly
- Check MongoDB connection

**Images Not Loading:**
- Images should work (they're from Unsplash)
- If issues, check browser console

---

## Step 8: Custom Domain (Optional)

### 8.1 Frontend Custom Domain (Vercel)

1. Go to Vercel → Your project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

### 8.2 Backend Custom Domain (Railway)

1. Go to Railway → Your service → Settings → Networking
2. Generate a domain or add custom domain
3. Update `FRONTEND_URL` in Railway with new domain

---

## 📝 Quick Reference

### Backend URL (Railway)
```
https://your-railway-url.up.railway.app
```

### Frontend URL (Vercel)
```
https://zappeats.vercel.app
```

### Environment Variables Checklist

**Backend (Railway):**
- [x] NODE_ENV=production
- [x] PORT=5000
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

**Backend:**
- Check Railway logs
- Verify `package.json` has `start` script
- Check Node version (should be 18+)

**Frontend:**
- Check Vercel build logs
- Verify `vite.config.js` is correct
- Check for build errors

### API Not Connecting

- Verify `VITE_API_URL` in Vercel matches Railway URL
- Check CORS settings in backend
- Verify backend is running (check Railway logs)

### Payment Not Working

- Verify Stripe keys are correct
- Check if using live keys (for production)
- Check Stripe dashboard for errors
- Verify webhook is set up correctly

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] User registration works
- [ ] User login works
- [ ] Can browse restaurants
- [ ] Can add items to cart
- [ ] Checkout works
- [ ] Payment processing works
- [ ] Orders are saved
- [ ] Order history works
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] Dark mode works

---

## 🎉 Congratulations!

Your ZappEats app is now live! Share your URL with others.

**Need Help?**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs


