const express = require('express');
const router = express.Router();
const { 
  generateSkillGap, 
  getSkillGap, 
  getUserSkillGaps, 
  deleteSkillGap,
  generateLearningPath,
  getLearningPath,
  updateLearningItem,
  getUserLearningPaths
} = require('../controllers/skillGapController');
const auth = require('../middleware/auth');

// All skill gap routes require authentication
router.use(auth);

// Generate skill gap analysis for a specific career
router.post('/career/:careerTitle', generateSkillGap);

// Get skill gap analysis for a specific career
router.get('/career/:careerTitle', getSkillGap);

// Get all skill gap analyses for current user
router.get('/', getUserSkillGaps);

// Delete a specific skill gap analysis
router.delete('/:id', deleteSkillGap);

// Learning Path Routes
// Generate detailed learning path for a specific career
router.post('/learning-path/career/:careerTitle', generateLearningPath);

// Get learning path for a specific career
router.get('/learning-path/career/:careerTitle', getLearningPath);

// Update learning item completion status
router.put('/learning-path/career/:careerTitle/item/:itemIndex', updateLearningItem);

// Get all learning paths for current user
router.get('/learning-path', getUserLearningPaths);

module.exports = router;
