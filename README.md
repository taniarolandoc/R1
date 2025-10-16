# Pension Investment Web App

A web application that helps users track, understand, and optimize their pension funds.

## Features

- **User Authentication**: Secure login and profile management
- **Dashboard**: Overview of total balance, contributions, and growth
- **Portfolio Visualization**: Charts showing allocation and performance
- **Risk Profiling**: Questionnaire to assess risk tolerance
- **Recommendations Engine**: Personalized investment suggestions
- **Educational Resources**: Guides on investment strategies and retirement planning

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Frontend**: EJS + Vanilla JavaScript
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
createdb pension_app

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
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Portfolio
- `GET /api/portfolio` - Get user portfolio
- `GET /api/portfolio/performance` - Get performance data

### Risk Assessment
- `POST /api/risk-assessment` - Submit risk questionnaire
- `GET /api/risk-assessment/results` - Get risk profile

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations

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
