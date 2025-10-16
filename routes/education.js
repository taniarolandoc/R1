const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// GET education page
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const category = req.query.category || 'all';

        let query = 'SELECT * FROM educational_content';
        let params = [];

        if (category !== 'all') {
            query += ' WHERE category = $1';
            params.push(category);
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        const articles = result.rows;

        // Get unique categories
        const categoriesResult = await db.query('SELECT DISTINCT category FROM educational_content');
        const categories = categoriesResult.rows.map(row => row.category);

        res.render('education/index', {
            articles,
            categories,
            selectedCategory: category
        });
    } catch (error) {
        console.error('Education error:', error);
        res.status(500).render('error', { error: 'Failed to load educational content' });
    }
});

// GET single article
router.get('/article/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query('SELECT * FROM educational_content WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).render('404');
        }

        const article = result.rows[0];

        // Get related articles from same category
        const relatedResult = await db.query(
            'SELECT * FROM educational_content WHERE category = $1 AND id != $2 LIMIT 3',
            [article.category, id]
        );
        const relatedArticles = relatedResult.rows;

        res.render('education/article', {
            article,
            relatedArticles
        });
    } catch (error) {
        console.error('Article error:', error);
        res.status(500).render('error', { error: 'Failed to load article' });
    }
});

module.exports = router;
