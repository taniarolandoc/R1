const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { isNotAuthenticated } = require('../middleware/auth');

// GET login page
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('auth/login', { error: null });
});

// POST login
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth/login', { error: 'Invalid email or password' });
    }

    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.render('auth/login', { error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.render('auth/login', { error: 'Invalid email or password' });
        }

        // Create session
        req.session.user = {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
        };

        // Generate JWT token for API access
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', { error: 'An error occurred. Please try again.' });
    }
});

// GET register page
router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('auth/register', { error: null });
});

// POST register
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('dateOfBirth').isDate()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth/register', { 
            error: 'Please provide valid information. Password must be at least 6 characters.' 
        });
    }

    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    try {
        // Check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (existingUser.rows.length > 0) {
            return res.render('auth/register', { error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await db.query(
            'INSERT INTO users (email, password_hash, first_name, last_name, date_of_birth) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name',
            [email, passwordHash, firstName, lastName, dateOfBirth]
        );

        const newUser = result.rows[0];

        // Create empty portfolio for the user
        await db.query(
            'INSERT INTO portfolios (user_id, total_balance, total_contributions, total_returns) VALUES ($1, 0, 0, 0)',
            [newUser.id]
        );

        // Create session
        req.session.user = {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name
        };

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/risk/questionnaire');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', { error: 'An error occurred. Please try again.' });
    }
});

// POST logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/');
});

// GET logout (for convenience)
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;
