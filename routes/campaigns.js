const express = require('express');
const router = express.Router();

// Dummy campaigns data
const campaigns = [
  {
    id: 1,
    name: 'Blue Ocean Sushi Bar',
    image: 'https://picsum.photos/seed/sushi/600/400',
    goal: 50000,
    raised: 32500,
    investors: 128,
    verified: true,
  },
  {
    id: 2,
    name: 'Urban Bean Coffee Roasters',
    image: 'https://picsum.photos/seed/coffee/600/400',
    goal: 30000,
    raised: 18450,
    investors: 92,
    verified: true,
  },
  {
    id: 3,
    name: 'Green Bowl Vegan Kitchen',
    image: 'https://picsum.photos/seed/vegan/600/400',
    goal: 40000,
    raised: 9500,
    investors: 44,
    verified: false,
  }
];

router.get('/', (req, res) => {
  res.render('campaigns/index', { title: 'Campaigns', campaigns });
});

module.exports = router;
