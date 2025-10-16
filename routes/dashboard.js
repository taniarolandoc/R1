const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { formatCurrency, formatPercentage, calculateAge, calculateYearsToRetirement } = require('../utils/helpers');

// GET dashboard
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get user details
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        // Get portfolio
        const portfolioResult = await db.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]);
        const portfolio = portfolioResult.rows[0];

        // Get risk profile
        const riskResult = await db.query('SELECT * FROM risk_profiles WHERE user_id = $1', [userId]);
        const riskProfile = riskResult.rows[0];

        // Get investment allocations
        const allocationsResult = await db.query(
            'SELECT * FROM investment_allocations WHERE portfolio_id = $1',
            [portfolio.id]
        );
        const allocations = allocationsResult.rows;

        // Get recent transactions
        const transactionsResult = await db.query(
            'SELECT * FROM transactions WHERE portfolio_id = $1 ORDER BY transaction_date DESC LIMIT 5',
            [portfolio.id]
        );
        const recentTransactions = transactionsResult.rows;

        // Get performance history (last 12 months)
        const performanceResult = await db.query(
            'SELECT * FROM performance_history WHERE portfolio_id = $1 ORDER BY date DESC LIMIT 12',
            [portfolio.id]
        );
        const performanceHistory = performanceResult.rows.reverse();

        // Get pending recommendations
        const recommendationsResult = await db.query(
            'SELECT * FROM recommendations WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT 3',
            [userId, 'pending']
        );
        const recommendations = recommendationsResult.rows;

        // Calculate metrics
        const totalReturn = portfolio.total_returns || 0;
        const returnPercentage = portfolio.total_contributions > 0 
            ? (totalReturn / portfolio.total_contributions) * 100 
            : 0;

        const age = user.date_of_birth ? calculateAge(user.date_of_birth) : null;
        const yearsToRetirement = user.date_of_birth ? calculateYearsToRetirement(user.date_of_birth) : null;

        res.render('dashboard/index', {
            user,
            portfolio,
            riskProfile,
            allocations,
            recentTransactions,
            performanceHistory,
            recommendations,
            metrics: {
                totalReturn,
                returnPercentage,
                age,
                yearsToRetirement
            },
            formatCurrency,
            formatPercentage
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', { error: 'Failed to load dashboard' });
    }
});

module.exports = router;
