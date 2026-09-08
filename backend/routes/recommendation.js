const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRecommendationsForUser } = require('../controllers/recommendationController');

router.post('/', auth, getRecommendationsForUser);

module.exports = router;
