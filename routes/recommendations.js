const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { formatCurrency, getRecommendedAllocation, calculateAge } = require('../utils/helpers');

// GET recommendations page
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get all recommendations
        const recommendationsResult = await db.query(
            'SELECT * FROM recommendations WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        const recommendations = recommendationsResult.rows;

        res.render('recommendations/index', {
            recommendations,
            formatCurrency
        });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).render('error', { error: 'Failed to load recommendations' });
    }
});

// POST generate recommendations
router.post('/generate', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get user data
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        // Get portfolio
        const portfolioResult = await db.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]);
        const portfolio = portfolioResult.rows[0];

        // Get risk profile
        const riskResult = await db.query('SELECT * FROM risk_profiles WHERE user_id = $1', [userId]);
        
        if (riskResult.rows.length === 0) {
            return res.redirect('/risk/questionnaire');
        }

        const riskProfile = riskResult.rows[0];

        // Get current allocations
        const allocationsResult = await db.query(
            'SELECT * FROM investment_allocations WHERE portfolio_id = $1',
            [portfolio.id]
        );
        const currentAllocations = allocationsResult.rows;

        // Calculate age
        const age = user.date_of_birth ? calculateAge(user.date_of_birth) : 30;

        // Get recommended allocation
        const recommendedAllocation = getRecommendedAllocation(riskProfile.risk_category, age);

        // Clear old pending recommendations
        await db.query(
            'DELETE FROM recommendations WHERE user_id = $1 AND status = $2',
            [userId, 'pending']
        );

        // Generate recommendations based on analysis
        const recommendations = [];

        // Check if portfolio needs rebalancing
        if (currentAllocations.length > 0) {
            const currentStocks = currentAllocations.find(a => a.asset_type === 'Stocks')?.allocation_percentage || 0;
            const recommendedStocks = recommendedAllocation.stocks;

            if (Math.abs(currentStocks - recommendedStocks) > 10) {
                recommendations.push({
                    type: 'Rebalance',
                    title: 'Portfolio Rebalancing Needed',
                    description: `Your current stock allocation (${currentStocks}%) differs significantly from the recommended ${recommendedStocks}% for your risk profile. Consider rebalancing to optimize your portfolio.`,
                    priority: 'High'
                });
            }
        }

        // Check contribution rate
        const monthlyContribution = portfolio.total_contributions / 12; // Simplified
        const recommendedContribution = riskProfile.monthly_income * 0.15; // 15% of income

        if (monthlyContribution < recommendedContribution) {
            recommendations.push({
                type: 'Increase Contribution',
                title: 'Increase Monthly Contributions',
                description: `Consider increasing your monthly contribution to ${formatCurrency(recommendedContribution)} (15% of income) to reach your retirement goal of ${formatCurrency(riskProfile.retirement_goal)}.`,
                priority: 'High'
            });
        }

        // Check diversification
        if (currentAllocations.length < 3) {
            recommendations.push({
                type: 'Change Allocation',
                title: 'Improve Diversification',
                description: 'Your portfolio lacks diversification. Consider spreading investments across stocks, bonds, real estate, and cash to reduce risk.',
                priority: 'Medium'
            });
        }

        // Check retirement readiness
        const yearsToRetirement = riskProfile.investment_horizon;
        const projectedSavings = portfolio.total_balance + (monthlyContribution * 12 * yearsToRetirement * 1.07); // 7% annual return

        if (projectedSavings < riskProfile.retirement_goal * 0.8) {
            recommendations.push({
                type: 'Increase Contribution',
                title: 'Retirement Goal at Risk',
                description: `Based on current contributions and expected returns, you may fall short of your retirement goal. Consider increasing contributions or adjusting your retirement expectations.`,
                priority: 'High'
            });
        }

        // Insert recommendations into database
        for (const rec of recommendations) {
            await db.query(
                'INSERT INTO recommendations (user_id, recommendation_type, title, description, priority, status) VALUES ($1, $2, $3, $4, $5, $6)',
                [userId, rec.type, rec.title, rec.description, rec.priority, 'pending']
            );
        }

        res.redirect('/recommendations');
    } catch (error) {
        console.error('Generate recommendations error:', error);
        res.status(500).render('error', { error: 'Failed to generate recommendations' });
    }
});

// POST update recommendation status
router.post('/:id/status', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.session.user.id;

        await db.query(
            'UPDATE recommendations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
            [status, id, userId]
        );

        res.redirect('/recommendations');
    } catch (error) {
        console.error('Update recommendation status error:', error);
        res.status(500).render('error', { error: 'Failed to update recommendation' });
    }
});

module.exports = router;
