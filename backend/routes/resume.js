const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create a new resume
router.post('/', resumeController.createResume);

// Get all resumes for the current user
router.get('/', resumeController.getUserResumes);

// Get user profile data for resume integration
router.get('/profile-data', resumeController.getUserProfileData);

// Get a specific resume by ID
router.get('/:id', resumeController.getResumeById);

// Update a resume
router.put('/:id', resumeController.updateResume);

// Delete a resume
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
