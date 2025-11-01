# ZappEats - Deployment Guide

## Production Readiness Checklist

### ✅ Completed
- [x] MongoDB Atlas connection configured
- [x] Database seeded with demo data
- [x] JWT authentication implemented
- [x] Stripe payment integration
- [x] Coupon system
- [x] Deal discounts
- [x] Error handling
- [x] Image fallbacks

### ⚠️ Needs Configuration Before Deployment

## Environment Variables

### Backend (.env)

Create `backend/.env` with the following:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zappeats?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# CORS (Frontend URL)
FRONTEND_URL=https://your-frontend-domain.com

# Stripe (Production Keys)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### Frontend (.env)

Create `frontend/.env` with:

```env
VITE_API_URL=https://your-backend-api-domain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
```

## Pre-Deployment Steps

### 1. Security Hardening

#### Backend:
- ✅ CORS configured (update FRONTEND_URL)
- ✅ Error handling (hides stack traces in production)
- ⚠️ Use strong JWT_SECRET (minimum 32 characters)
- ⚠️ Switch Stripe to live keys
- ⚠️ Restrict MongoDB Atlas IP whitelist (remove 0.0.0.0/0)

#### Frontend:
- ⚠️ Update API URL to production backend
- ⚠️ Update Stripe publishable key to live key
- ⚠️ Build and test production build

### 2. Database Setup

```bash
# Connect to MongoDB Atlas (already done ✅)
# Seed database
cd backend
npm run seed
node utils/seedCoupons.js
```

### 3. Stripe Production Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch from Test mode to Live mode
3. Get Live API keys:
   - Secret Key: `sk_live_...`
   - Publishable Key: `pk_live_...`
4. Configure Webhook:
   - Add webhook endpoint: `https://your-backend-domain.com/api/payments/webhook`
   - Copy webhook signing secret: `whsec_...`

## Deployment Platforms

### Frontend Deployment (Recommended: Vercel/Netlify)

#### Option 1: Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set build settings:
   - Framework Preset: Vite
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`
5. Add environment variables:
   - `VITE_API_URL`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
6. Deploy

#### Option 2: Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Add new site from Git
4. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables (same as Vercel)
6. Deploy

### Backend Deployment (Recommended: Railway/Render/Render)

#### Option 1: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add MongoDB service (or use Atlas)
4. Add Node.js service
5. Connect GitHub repo
6. Set root directory to `backend`
7. Add environment variables
8. Deploy

#### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

#### Option 3: Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create zappeats-api`
4. Add MongoDB Atlas connection
5. Set environment variables: `heroku config:set KEY=value`
6. Deploy: `git push heroku main`

## Build Commands

### Frontend
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Backend
```bash
cd backend
npm install --production
# Server starts with: npm start
```

## Testing Production Build

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

## Important Security Notes

1. **Never commit .env files** - Already in .gitignore ✅
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **Restrict CORS** - Set FRONTEND_URL to your production domain
4. **MongoDB IP Whitelist** - Remove 0.0.0.0/0, add specific IPs
5. **Stripe Webhooks** - Must use HTTPS in production
6. **Environment Variables** - Set in hosting platform, not in code

## Post-Deployment Checklist

- [ ] Test user registration/login
- [ ] Test restaurant browsing
- [ ] Test adding items to cart
- [ ] Test checkout with coupon
- [ ] Test payment with Stripe (test card first, then live)
- [ ] Verify orders are saved
- [ ] Check order history
- [ ] Test search functionality
- [ ] Verify images load correctly
- [ ] Check mobile responsiveness
- [ ] Test dark mode
- [ ] Verify all routes work

## Monitoring & Maintenance

- Set up error logging (e.g., Sentry)
- Monitor MongoDB Atlas metrics
- Monitor API response times
- Set up uptime monitoring
- Regular database backups (Atlas handles this)

## Troubleshooting

### Common Issues:
1. **CORS errors** → Check FRONTEND_URL matches your frontend domain
2. **Database connection fails** → Verify MongoDB Atlas IP whitelist
3. **Stripe errors** → Verify live keys are set correctly
4. **Build fails** → Check Node version matches (v18+)

## Support

For deployment issues, check:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)

