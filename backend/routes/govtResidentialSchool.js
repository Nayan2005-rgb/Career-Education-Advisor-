const express = require('express');
const router = express.Router();
const {
  searchSchools,
  getSchoolsByCategory,
  getSchoolDetails,
  getStates,
  getDistrictsByState,
  getFilterOptions
} = require('../controllers/govtResidentialSchoolController');

// All routes are public - no authentication required
router.get('/search', searchSchools);
router.get('/category/:category', getSchoolsByCategory);
router.get('/details/:id', getSchoolDetails);
router.get('/states', getStates);
router.get('/states/:state/districts', getDistrictsByState);
router.get('/filters', getFilterOptions);

module.exports = router;
