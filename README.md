# TastyFund - Restaurant Investment Crowdfunding Platform

A digital platform that enables investment crowdfunding for startup and small-sized restaurants to raise targeted funds for specific operational goals. TastyFund connects restaurants with community investors through verified campaigns, milestone tracking, and blockchain-powered transparency.

## Problem We Solve

Small restaurants struggle to access traditional financing due to strict lending requirements, lack of collateral, and limited financial history. In Korea, banks faced $1.8 billion USD in penalties for failing SME loan quotas, revealing a structural gap in small business financing. TastyFund provides an alternative funding channel that empowers communities to invest directly in local restaurants.

## Features

- **Dual User Authentication**: Secure login for both restaurants (fundraisers) and investors with KYC verification
- **Restaurant Dashboard**: Campaign creation, funding progress tracking, milestone management, and investor communications
- **Investor Dashboard**: Browse campaigns, investment portfolio overview, returns tracking, and restaurant performance monitoring
- **Campaign Listings**: Detailed restaurant profiles with business plans, funding goals, use of funds breakdown, and risk assessments
- **Milestone Tracking**: Transparent progress updates tied to fund disbursement stages
- **Blockchain Integration**: Immutable transaction records, smart contracts for fund release, and transparent capital usage tracking
- **Investment Tools**: Minimum investment thresholds, diversification recommendations, and risk profiling
- **Verification System**: Restaurant validation including business registration, financial health checks, and operational history
- **Community Features**: Investor reviews, restaurant updates, and success stories

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL (with blockchain integration layer)
- **Frontend**: EJS + Vanilla JavaScript
- **Blockchain**: Smart contracts for fund management and transparency
- **Hosting**: Railway (backend) + Vercel (frontend)

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd R1-1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` file with your database credentials and secrets.

4. Set up the database:
```bash
# Create the database
createdb tastyfund_db

# Run migrations
npm run migrate
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
R1-1/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── models/          # Database models
├── routes/          # API routes
├── views/           # EJS templates
├── public/          # Static files (CSS, JS, images)
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── database/        # Database migrations and seeds
├── server.js        # Main application file
└── package.json     # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (investor or restaurant)
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/kyc` - Submit KYC verification

### Campaigns
- `GET /api/campaigns` - Browse all restaurant campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create new campaign (restaurant only)
- `PUT /api/campaigns/:id` - Update campaign
- `GET /api/campaigns/:id/milestones` - Get campaign milestones

### Investments
- `POST /api/investments` - Make an investment
- `GET /api/investments/portfolio` - Get investor portfolio
- `GET /api/investments/:id` - Get investment details
- `GET /api/investments/returns` - Track investment returns

### Restaurant Dashboard
- `GET /api/restaurant/dashboard` - Get restaurant dashboard data
- `GET /api/restaurant/investors` - Get list of investors
- `POST /api/restaurant/updates` - Post campaign update
- `POST /api/restaurant/milestones` - Update milestone progress

### Blockchain
- `GET /api/blockchain/transactions` - View blockchain transaction history
- `GET /api/blockchain/verify/:txId` - Verify transaction on blockchain

## Deployment

### Backend (Railway)
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Frontend (Vercel)
1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure build settings
4. Deploy

## License

ISC
