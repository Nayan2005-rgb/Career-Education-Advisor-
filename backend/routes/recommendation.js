const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRecommendationsForUser, getCareerDetails } = require('../controllers/recommendationController');

router.post('/', auth, getRecommendationsForUser);
router.get('/:careerTitle', getCareerDetails);

module.exports = router;
