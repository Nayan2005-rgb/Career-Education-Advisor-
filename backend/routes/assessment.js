const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitAssessment, getHistory } = require('../controllers/assessmentController');

router.post('/', auth, submitAssessment);
router.get('/history', auth, getHistory);

module.exports = router;
