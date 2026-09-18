const express = require('express');
const router = express.Router();
const {
  searchSchools,
  getSchoolsByCategory,
  getSchoolDetails,
  getStates,
  getCitiesByState,
  saveSchool,
  getSavedSchools,
  removeSavedSchool,
  compareSchools,
  getFilterOptions
} = require('../controllers/schoolController');
const auth = require('../middleware/auth');

// Public routes - no authentication required
router.get('/search', searchSchools);
router.get('/category/:category', getSchoolsByCategory);
router.get('/details/:id', getSchoolDetails);
router.get('/states', getStates);
router.get('/states/:state/cities', getCitiesByState);
router.get('/filters', getFilterOptions);

// Protected routes - require authentication
router.use(auth);

// Save a school
router.post('/save/:schoolId', saveSchool);

// Get saved schools for current user
router.get('/saved', getSavedSchools);

// Remove a saved school
router.delete('/saved/:schoolId', removeSavedSchool);

// Compare schools
router.post('/compare', compareSchools);

module.exports = router;
