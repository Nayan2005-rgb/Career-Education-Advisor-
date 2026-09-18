const express = require('express');
const router = express.Router();
const {
  searchScholarships,
  getScholarshipsByCourse,
  getScholarshipsByState,
  getScholarshipsByCategory,
  getScholarshipDetails,
  getFilterOptions
} = require('../controllers/scholarshipController');

// Public routes - no authentication required
router.get('/search', searchScholarships);
router.get('/course/:course', getScholarshipsByCourse);
router.get('/state/:state', getScholarshipsByState);
router.get('/category/:category', getScholarshipsByCategory);
router.get('/details/:id', getScholarshipDetails);
router.get('/filters', getFilterOptions);

module.exports = router;
