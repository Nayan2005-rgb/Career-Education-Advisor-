const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  searchScholarships,
  getScholarshipsByCourse,
  getScholarshipsByState,
  getScholarshipsByCategory,
  getScholarshipDetails,
  getFilterOptions,
  checkEligibility,
  checkEligibilityBatch,
  saveScholarship,
  getSavedScholarships,
  removeSavedScholarship
} = require('../controllers/scholarshipController');

// Public routes - no authentication required
router.get('/search', searchScholarships);
router.get('/course/:course', getScholarshipsByCourse);
router.get('/state/:state', getScholarshipsByState);
router.get('/category/:category', getScholarshipsByCategory);
router.get('/details/:id', getScholarshipDetails);
router.get('/filters', getFilterOptions);

// Protected routes - require authentication
router.use(auth);

// Check eligibility for a specific scholarship
router.get('/eligibility/:id', checkEligibility);

// Check eligibility for all scholarships
router.get('/eligibility', checkEligibilityBatch);

// Save a scholarship
router.post('/save/:scholarshipId', saveScholarship);

// Get saved scholarships for current user
router.get('/saved', getSavedScholarships);

// Remove a saved scholarship
router.delete('/saved/:scholarshipId', removeSavedScholarship);

module.exports = router;
