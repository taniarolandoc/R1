const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('create-campaign/index', { title: 'Start a Campaign' });
});

module.exports = router;
