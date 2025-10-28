const express = require('express');
const router = express.Router();

// Dummy investor dashboard data
const metrics = {
  totalInvested: 42500,
  roi: 12.6,
  campaignsSupported: 7,
  verifiedMilestones: 18
};

const performance = [
  { label: 'Jan', value: 32000 },
  { label: 'Feb', value: 33500 },
  { label: 'Mar', value: 34250 },
  { label: 'Apr', value: 35500 },
  { label: 'May', value: 38000 },
  { label: 'Jun', value: 40250 }
];

router.get('/', (req, res) => {
  res.render('investor/dashboard', { title: 'Investor Dashboard', metrics, performance });
});

module.exports = router;
