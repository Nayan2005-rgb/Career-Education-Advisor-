const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create or get roadmap for a career
router.post('/', roadmapController.createOrGetRoadmap);

// Get all roadmaps for user
router.get('/', roadmapController.getUserRoadmaps);

// Get roadmap for specific career
router.get('/career/:careerTitle', roadmapController.getRoadmap);

// Update step status
router.put('/:roadmapId/steps/:stepId', roadmapController.updateStepStatus);

// Delete roadmap
router.delete('/:roadmapId', roadmapController.deleteRoadmap);

module.exports = router;
