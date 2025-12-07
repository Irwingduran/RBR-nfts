# NFT Attendance System

A complete NFT attendance system built with Next.js, Prisma, Magic.link, and Pinata IPFS. Users can claim unique NFT badges for attending events.

## Features

- **Magic.link Authentication**: Passwordless email authentication
- **NFT Minting**: Automatic NFT creation and minting for event attendance
- **IPFS Storage**: Metadata and images stored on IPFS via Pinata
- **User Dashboard**: View and manage claimed NFTs
- **Admin Panel**: Create events, manage claims, and view analytics
- **Responsive Design**: Beautiful UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Magic.link
- **Storage**: Pinata IPFS
- **UI**: Tailwind CSS v4, shadcn/ui
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Magic.link account
- Pinata account

### Environment Variables

Create a `.env` file with the following variables:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nft_attendance"

# Magic.link
MAGIC_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY="pk_live_..."

# Pinata IPFS
PINATA_API_KEY="your_api_key"
PINATA_API_SECRET="your_api_secret"
# Or use JWT
PINATA_JWT="your_jwt_token"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run Prisma migrations:
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

3. Seed the database (optional):
\`\`\`bash
npx prisma db execute --file scripts/002-seed-sample-event.sql
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Database Schema

The system uses three main models:

- **User**: Stores user accounts with email and wallet addresses
- **Event**: Stores event information with claim codes
- **NFT**: Links users to events with unique token IDs and IPFS metadata

## API Routes

### Public Routes
- `POST /api/auth/login` - Authenticate with Magic.link
- `GET /api/nft/metadata/[tokenId]` - Get NFT metadata (public)

### Protected Routes
- `POST /api/nft/claim` - Claim an NFT for an event
- `GET /api/nft/user` - Get user's NFT collection
- `GET /api/auth/me` - Get current user info

### Admin Routes
- `POST /api/admin/events` - Create new event
- `PATCH /api/admin/events/[eventId]` - Update event status
- `POST /api/ipfs/upload` - Upload image to IPFS
- `POST /api/ipfs/metadata` - Generate metadata preview

## Usage

### For Users

1. Visit the app and click "Get Started"
2. Enter your email to receive a magic link
3. Click "Claim NFT" and enter an event code
4. View your NFT collection in the dashboard

### For Admins

1. Get admin access (set `role = 'ADMIN'` in database)
2. Access the admin panel from the dashboard
3. Create events with unique claim codes
4. Monitor NFT claims and manage event status

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   └── nft/               # NFT detail pages
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── magic.ts          # Magic.link integration
│   ├── pinata.ts         # Pinata IPFS integration
│   └── nft-generator.ts  # NFT metadata generation
├── prisma/               # Database schema
└── scripts/              # SQL scripts
\`\`\`

## License

MIT
