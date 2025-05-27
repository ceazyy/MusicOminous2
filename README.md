# CEAZY - Dark Techno Music Shop

A modern, dark-themed music shop website for electronic and techno music releases.

## Features

- 🎵 Music album showcase with cover art
- 🛒 Stripe-powered payment system
- 📱 Responsive design with dark aesthetic
- ⚡ Built with React + Vite frontend
- 🚀 Express.js backend with API routes
- 💾 PostgreSQL database with Drizzle ORM

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe
- **Deployment**: Vercel

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo)

### Manual Deployment Steps

1. **Fork/Clone this repository**

2. **Set up a PostgreSQL database** (optional, but recommended for production)
   - [Neon](https://neon.tech/) (Recommended - serverless PostgreSQL)
   - [Supabase](https://supabase.com/)
   - [Railway](https://railway.app/)

3. **Set up Stripe account**
   - Get your Stripe Secret Key and Publishable Key
   - Set up webhook endpoints (optional)

4. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

5. **Configure Environment Variables in Vercel Dashboard**
   
   Go to your project settings in Vercel and add these environment variables:
   
   ```env
   # Database (optional - uses in-memory storage if not provided)
   DATABASE_URL=postgresql://username:password@host:port/database
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   
   # Node Environment
   NODE_ENV=production
   ```

6. **Initialize Database** (if using PostgreSQL)
   ```bash
   npm run db:push
   ```

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database (optional for development)
   DATABASE_URL=postgresql://username:password@localhost:5432/ceazy
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   
   # Development
   NODE_ENV=development
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open [http://localhost:5000](http://localhost:5000)

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/               # Source files
│   └── index.html         # HTML template
├── server/                # Express.js backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
├── api/                   # Vercel serverless functions
│   └── index.js           # API handler for Vercel
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies and scripts
```

## API Endpoints

- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get single album
- `POST /api/create-payment-intent` - Create Stripe checkout session
- `POST /api/purchase/:id` - Complete purchase

## Database Schema

The application uses PostgreSQL with Drizzle ORM. Main tables:

- **users** - User accounts
- **albums** - Music albums with metadata

## Stripe Integration

The app integrates with Stripe for payments:

1. Users browse albums
2. Click purchase to create Stripe Checkout session
3. Complete payment on Stripe-hosted page
4. Redirect back to app with success/cancel status

## Environment Variables

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed environment variable documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub. 