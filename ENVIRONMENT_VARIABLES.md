# Environment Variables for Vercel Deployment

## Required Environment Variables

Set these environment variables in your Vercel dashboard:

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string (e.g., from Neon, Supabase, or other PostgreSQL provider)
  - Format: `postgresql://username:password@host:port/database`

### Stripe Configuration (for payments)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_`)
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_`)

### Node Environment
- `NODE_ENV` - Set to `production` for Vercel deployment

## Setting Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its corresponding value
4. Make sure to set them for Production, Preview, and Development environments as needed

## Database Setup

For the database, you can use:
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Railway](https://railway.app/) - Deploy PostgreSQL instantly
- [PlanetScale](https://planetscale.com/) - MySQL alternative

Make sure to run the database migrations after setting up your database:
```bash
npm run db:push
``` 