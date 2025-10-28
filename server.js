const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make user available to all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const portfolioRoutes = require('./routes/portfolio');
const riskRoutes = require('./routes/risk');
const recommendationsRoutes = require('./routes/recommendations');
const educationRoutes = require('./routes/education');
const campaignsRoutes = require('./routes/campaigns');
const investorRoutes = require('./routes/investor');
const createCampaignRoutes = require('./routes/createCampaign');

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/risk', riskRoutes);
app.use('/recommendations', recommendationsRoutes);
app.use('/education', educationRoutes);
app.use('/campaigns', campaignsRoutes);
app.use('/investor-dashboard', investorRoutes);
app.use('/create-campaign', createCampaignRoutes);

// Home route
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('index');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
