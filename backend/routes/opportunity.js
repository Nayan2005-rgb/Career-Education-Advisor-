const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  searchOpportunities,
  getOpportunityDetails,
  getPersonalizedRecommendations,
  saveOpportunity,
  getSavedOpportunities,
  removeSavedOpportunity,
  createApplicationTracking,
  getUserApplications,
  updateApplicationTracking,
  deleteApplicationTracking,
  getFilterOptions
} = require('../controllers/opportunityController');

// Public routes
router.get('/search', searchOpportunities);
router.get('/details/:id', getOpportunityDetails);
router.get('/filters', getFilterOptions);

// Authenticated routes
router.get('/recommendations', auth, getPersonalizedRecommendations);
router.post('/save/:opportunityId', auth, saveOpportunity);
router.get('/saved', auth, getSavedOpportunities);
router.delete('/saved/:opportunityId', auth, removeSavedOpportunity);
router.post('/track/:opportunityId', auth, createApplicationTracking);
router.get('/applications', auth, getUserApplications);
router.put('/applications/:id', auth, updateApplicationTracking);
router.delete('/applications/:id', auth, deleteApplicationTracking);

module.exports = router;
