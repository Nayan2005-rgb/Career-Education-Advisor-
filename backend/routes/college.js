const express = require('express');
const router = express.Router();
const {
  searchColleges,
  getCollegesByCareer,
  getCollegesByStream,
  getCollegeDetails,
  getStates,
  getCitiesByState,
  saveCollege,
  getSavedColleges,
  removeSavedCollege,
  compareColleges,
  getFilterOptions
} = require('../controllers/collegeController');
const auth = require('../middleware/auth');

// Public routes - no authentication required
router.get('/search', searchColleges);
router.get('/career/:careerTitle', getCollegesByCareer);
router.get('/stream/:stream', getCollegesByStream);
router.get('/details/:id', getCollegeDetails);
router.get('/states', getStates);
router.get('/states/:state/cities', getCitiesByState);
router.get('/filters', getFilterOptions);

// Protected routes - require authentication
router.use(auth);

// Save a college
router.post('/save/:collegeId', saveCollege);

// Get saved colleges for current user
router.get('/saved', getSavedColleges);

// Remove a saved college
router.delete('/saved/:collegeId', removeSavedCollege);

// Compare colleges
router.post('/compare', compareColleges);

module.exports = router;
