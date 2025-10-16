const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { formatCurrency, formatPercentage, formatDate } = require('../utils/helpers');

// GET portfolio page
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get portfolio
        const portfolioResult = await db.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]);
        const portfolio = portfolioResult.rows[0];

        // Get investment allocations
        const allocationsResult = await db.query(
            'SELECT * FROM investment_allocations WHERE portfolio_id = $1',
            [portfolio.id]
        );
        const allocations = allocationsResult.rows;

        // Get all transactions
        const transactionsResult = await db.query(
            'SELECT * FROM transactions WHERE portfolio_id = $1 ORDER BY transaction_date DESC',
            [portfolio.id]
        );
        const transactions = transactionsResult.rows;

        // Get performance history
        const performanceResult = await db.query(
            'SELECT * FROM performance_history WHERE portfolio_id = $1 ORDER BY date ASC',
            [portfolio.id]
        );
        const performanceHistory = performanceResult.rows;

        res.render('portfolio/index', {
            portfolio,
            allocations,
            transactions,
            performanceHistory,
            formatCurrency,
            formatPercentage,
            formatDate
        });
    } catch (error) {
        console.error('Portfolio error:', error);
        res.status(500).render('error', { error: 'Failed to load portfolio' });
    }
});

// POST add transaction
router.post('/transaction', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { type, amount, description, date } = req.body;

        // Get portfolio
        const portfolioResult = await db.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]);
        const portfolio = portfolioResult.rows[0];

        // Insert transaction
        await db.query(
            'INSERT INTO transactions (portfolio_id, transaction_type, amount, description, transaction_date) VALUES ($1, $2, $3, $4, $5)',
            [portfolio.id, type, amount, description, date]
        );

        // Update portfolio balance
        if (type === 'Contribution') {
            await db.query(
                'UPDATE portfolios SET total_balance = total_balance + $1, total_contributions = total_contributions + $1 WHERE id = $2',
                [amount, portfolio.id]
            );
        } else if (type === 'Withdrawal') {
            await db.query(
                'UPDATE portfolios SET total_balance = total_balance - $1 WHERE id = $2',
                [amount, portfolio.id]
            );
        }

        res.redirect('/portfolio');
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).render('error', { error: 'Failed to add transaction' });
    }
});

module.exports = router;
