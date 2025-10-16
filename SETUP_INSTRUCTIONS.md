# Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## Installation Steps

### 1. Clone and Install Dependencies

```bash
cd R1-1
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=pension_app
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=your_jwt_secret_key_here_change_in_production
SESSION_SECRET=your_session_secret_key_here_change_in_production
```

### 3. Set Up PostgreSQL Database

Create the database:

```bash
# On Windows (PowerShell)
& "C:\Program Files\PostgreSQL\15\bin\createdb.exe" -U postgres pension_app

# Or using psql
psql -U postgres
CREATE DATABASE pension_app;
\q
```

Run the schema to create tables:

```bash
# On Windows (PowerShell)
Get-Content database\schema.sql | & "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d pension_app

# Or using psql directly
psql -U postgres -d pension_app -f database/schema.sql
```

Seed the database with educational content:

```bash
# On Windows (PowerShell)
Get-Content database\seed.sql | & "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d pension_app

# Or using psql directly
psql -U postgres -d pension_app -f database/seed.sql
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Create Your First Account

1. Navigate to `http://localhost:3000`
2. Click "Get Started" or "Sign Up"
3. Fill in your information
4. Complete the risk profile questionnaire
5. Start exploring your dashboard!

## Project Structure

```
R1-1/
├── config/              # Configuration files
│   └── database.js      # Database connection
├── controllers/         # Route controllers (future)
├── database/            # Database files
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Seed data
├── middleware/          # Custom middleware
│   └── auth.js          # Authentication middleware
├── models/              # Database models (future)
├── public/              # Static files
│   ├── css/
│   │   └── style.css    # Main stylesheet
│   └── js/
│       └── main.js      # Client-side JavaScript
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── dashboard.js     # Dashboard routes
│   ├── portfolio.js     # Portfolio routes
│   ├── risk.js          # Risk assessment routes
│   ├── recommendations.js # Recommendations routes
│   └── education.js     # Educational content routes
├── utils/               # Utility functions
│   └── helpers.js       # Helper functions
├── views/               # EJS templates
│   ├── auth/            # Authentication views
│   ├── dashboard/       # Dashboard views
│   ├── portfolio/       # Portfolio views
│   ├── risk/            # Risk assessment views
│   ├── recommendations/ # Recommendations views
│   ├── education/       # Educational content views
│   ├── index.ejs        # Landing page
│   ├── 404.ejs          # 404 page
│   └── error.ejs        # Error page
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
├── server.js            # Main application file
└── README.md            # Project documentation
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # On Windows
   Get-Service -Name postgresql*
   ```

2. Check your database credentials in `.env`
3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 3000 is already in use, change the PORT in `.env`:

```
PORT=3001
```

### Module Not Found Errors

Reinstall dependencies:

```bash
rm -rf node_modules
npm install
```

## Next Steps

1. Customize the application for your needs
2. Add more educational content
3. Implement additional features from the PRD
4. Deploy to production (Railway + Vercel)

## Deployment

### Backend (Railway)

1. Create a Railway account at https://railway.app
2. Create a new project
3. Add PostgreSQL database
4. Connect your GitHub repository
5. Set environment variables in Railway dashboard
6. Deploy

### Frontend (Vercel)

Since this is a server-side rendered application, you can deploy the entire app to Railway or use Vercel for the Node.js backend:

1. Create a Vercel account at https://vercel.com
2. Import your GitHub repository
3. Configure build settings
4. Set environment variables
5. Deploy

## Support

For issues or questions, please refer to the README.md or create an issue in the repository.
