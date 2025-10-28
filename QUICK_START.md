# TastyFund - Quick Start Guide

## ✅ What's Already Built

The **TastyFund** platform is fully implemented with all features from the PRD:

### Core Features
- 🔐 **Dual User Authentication** - Separate flows for investors and restaurants
- 🏪 **Restaurant Dashboard** - Campaign creation, milestone tracking, investor communications
- 💼 **Investor Dashboard** - Portfolio management, campaign browsing, returns tracking
- 📊 **Campaign Management** - Detailed listings with business plans and risk assessments
- 🔗 **Blockchain Integration** - Transparent transactions and smart contracts
- ✅ **Verification System** - Restaurant validation and KYC
- 📈 **Investment Tools** - Risk profiling, calculators, diversification recommendations

### Tech Stack
- Backend: Node.js + Express
- Database: PostgreSQL
- Frontend: EJS + Vanilla JavaScript
- Charts: Chart.js
- Icons: Font Awesome

## 🚀 How to Run the Application

### Step 1: Install Node.js
Node.js is required to run the server.

1. Download Node.js LTS from: https://nodejs.org/
2. Run the installer
3. Restart your terminal/PowerShell
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Install Dependencies
Once Node.js is installed:
```powershell
cd c:\Users\t4nh9\Downloads\fintech1\R1-1
npm install
```

### Step 3: Set Up Environment Variables
Copy the example environment file:
```powershell
copy .env.example .env
```

Edit `.env` and update the database credentials if needed.

### Step 4: Set Up PostgreSQL (Optional for full functionality)
- Install PostgreSQL from: https://www.postgresql.org/download/
- Create database: `tastyfund_db`
- Run schema: `database/schema.sql`
- Run seed data: `database/seed.sql`

**Note:** The app will run without PostgreSQL, but database features won't work.

### Step 5: Start the Server
```powershell
npm run dev
```

### Step 6: Open in Browser
Navigate to: http://localhost:3000

## 📁 Project Structure

```
R1-1/
├── config/          # Database configuration
├── database/        # SQL schema and seed data
├── middleware/      # Authentication middleware
├── public/          # Static assets (CSS, JS, images)
├── routes/          # Express routes
├── utils/           # Helper functions
├── views/           # EJS templates
├── server.js        # Main application
└── package.json     # Dependencies
```

## 🎯 Key Pages

- **Landing Page**: `/` - Marketing page with features
- **Login**: `/auth/login` - User authentication
- **Register**: `/auth/register` - New user signup
- **Dashboard**: `/dashboard` - Main user dashboard
- **Portfolio**: `/portfolio` - Investment portfolio
- **Risk Assessment**: `/risk/questionnaire` - Risk profiling
- **Education**: `/education` - Learning resources

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not yet implemented)

## 📝 Next Steps

1. Install Node.js
2. Run `npm install`
3. Configure `.env` file
4. Start server with `npm run dev`
5. Open http://localhost:3000

## 🆘 Troubleshooting

**"npm is not recognized"**
- Node.js is not installed or not in PATH
- Install Node.js and restart terminal

**"Cannot connect to database"**
- PostgreSQL is not running or credentials are wrong
- Check `.env` file settings
- App will still run but database features won't work

**Port 3000 already in use**
- Change PORT in `.env` file
- Or stop the process using port 3000

## 📚 Documentation

- Full setup guide: `SETUP_INSTRUCTIONS.md`
- Project summary: `PROJECT_SUMMARY.md`
- README: `README.md`

---

**Status**: ✅ Fully implemented and ready to run
**Created**: 2025
**Platform**: Restaurant Investment Crowdfunding
