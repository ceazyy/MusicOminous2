# Vercel Deployment Guide

## Quick Deployment

### Option 1: Deploy with Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
3. **Click "New Project"**
4. **Import your repository**
5. **Configure environment variables** (see below)
6. **Deploy!**

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Required Environment Variables

Set these in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `DATABASE_URL` | PostgreSQL connection (optional) | `postgresql://...` |
| `NODE_ENV` | Environment | `production` |

## Setting Environment Variables

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Set for **Production**, **Preview**, and **Development** as needed

## Database Setup (Optional)

If you want to use a real database instead of in-memory storage:

1. **Create a PostgreSQL database** on:
   - [Neon](https://neon.tech/) (Recommended)
   - [Supabase](https://supabase.com/)
   - [Railway](https://railway.app/)

2. **Add DATABASE_URL to environment variables**

3. **Run database migrations**:
   ```bash
   npm run db:push
   ```

## Custom Domain (Optional)

1. Go to project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain
4. Update DNS records as instructed

## That's it! 🚀

Your CEAZY music website should now be live on Vercel! 