const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { getRiskCategory, getRecommendedAllocation, calculateAge, calculateYearsToRetirement } = require('../utils/helpers');

// GET risk questionnaire
router.get('/questionnaire', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Check if user already has a risk profile
        const existingProfile = await db.query('SELECT * FROM risk_profiles WHERE user_id = $1', [userId]);
        
        res.render('risk/questionnaire', {
            hasExistingProfile: existingProfile.rows.length > 0,
            existingProfile: existingProfile.rows[0] || null
        });
    } catch (error) {
        console.error('Risk questionnaire error:', error);
        res.status(500).render('error', { error: 'Failed to load questionnaire' });
    }
});

// POST risk questionnaire
router.post('/questionnaire', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const {
            investmentHorizon,
            monthlyIncome,
            currentSavings,
            retirementGoal,
            riskComfort,
            marketVolatility,
            investmentKnowledge,
            lossReaction,
            investmentGoal
        } = req.body;

        // Calculate risk score (1-10 scale)
        let riskScore = 0;
        
        // Investment horizon (longer = more risk tolerance)
        riskScore += parseInt(investmentHorizon) / 5;
        
        // Risk comfort level
        riskScore += parseInt(riskComfort);
        
        // Market volatility tolerance
        riskScore += parseInt(marketVolatility);
        
        // Investment knowledge
        riskScore += parseInt(investmentKnowledge);
        
        // Loss reaction (inverted - lower number = more risk averse)
        riskScore += parseInt(lossReaction);
        
        // Investment goal
        riskScore += parseInt(investmentGoal);
        
        // Normalize to 1-10 scale
        riskScore = Math.round(Math.min(10, Math.max(1, riskScore / 6 * 10)));
        
        const riskCategory = getRiskCategory(riskScore);

        // Get user's date of birth for age calculation
        const userResult = await db.query('SELECT date_of_birth FROM users WHERE id = $1', [userId]);
        const dateOfBirth = userResult.rows[0].date_of_birth;
        const yearsToRetirement = dateOfBirth ? calculateYearsToRetirement(dateOfBirth) : parseInt(investmentHorizon);

        const questionnaireData = {
            investmentHorizon,
            monthlyIncome,
            currentSavings,
            retirementGoal,
            riskComfort,
            marketVolatility,
            investmentKnowledge,
            lossReaction,
            investmentGoal
        };

        // Check if profile exists
        const existingProfile = await db.query('SELECT * FROM risk_profiles WHERE user_id = $1', [userId]);

        if (existingProfile.rows.length > 0) {
            // Update existing profile
            await db.query(
                `UPDATE risk_profiles 
                SET risk_score = $1, risk_category = $2, investment_horizon = $3, 
                    monthly_income = $4, current_savings = $5, retirement_goal = $6, 
                    questionnaire_data = $7, updated_at = CURRENT_TIMESTAMP 
                WHERE user_id = $8`,
                [riskScore, riskCategory, yearsToRetirement, monthlyIncome, currentSavings, 
                 retirementGoal, JSON.stringify(questionnaireData), userId]
            );
        } else {
            // Insert new profile
            await db.query(
                `INSERT INTO risk_profiles 
                (user_id, risk_score, risk_category, investment_horizon, monthly_income, 
                 current_savings, retirement_goal, questionnaire_data) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [userId, riskScore, riskCategory, yearsToRetirement, monthlyIncome, 
                 currentSavings, retirementGoal, JSON.stringify(questionnaireData)]
            );
        }

        res.redirect('/risk/results');
    } catch (error) {
        console.error('Risk questionnaire submission error:', error);
        res.status(500).render('error', { error: 'Failed to submit questionnaire' });
    }
});

// GET risk results
router.get('/results', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get risk profile
        const profileResult = await db.query('SELECT * FROM risk_profiles WHERE user_id = $1', [userId]);
        
        if (profileResult.rows.length === 0) {
            return res.redirect('/risk/questionnaire');
        }

        const riskProfile = profileResult.rows[0];

        // Get user's age
        const userResult = await db.query('SELECT date_of_birth FROM users WHERE id = $1', [userId]);
        const dateOfBirth = userResult.rows[0].date_of_birth;
        const age = dateOfBirth ? calculateAge(dateOfBirth) : 30;

        // Get recommended allocation
        const recommendedAllocation = getRecommendedAllocation(riskProfile.risk_category, age);

        res.render('risk/results', {
            riskProfile,
            recommendedAllocation
        });
    } catch (error) {
        console.error('Risk results error:', error);
        res.status(500).render('error', { error: 'Failed to load results' });
    }
});

module.exports = router;
