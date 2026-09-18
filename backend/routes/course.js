const express = require('express');
const router = express.Router();
const {
  searchCourses,
  getCoursesByCareer,
  getCoursesByDuration,
  getCoursesByEntranceExam,
  getCourseDetails,
  getDurations,
  getCareers,
  getEntranceExams,
  getColleges,
  saveCourse,
  getSavedCourses,
  removeSavedCourse,
  compareCourses,
  getFilterOptions
} = require('../controllers/courseController');
const auth = require('../middleware/auth');

// Public routes - no authentication required
router.get('/search', searchCourses);
router.get('/career/:careerTitle', getCoursesByCareer);
router.get('/duration/:duration', getCoursesByDuration);
router.get('/entrance-exam/:exam', getCoursesByEntranceExam);
router.get('/details/:id', getCourseDetails);
router.get('/durations', getDurations);
router.get('/careers', getCareers);
router.get('/entrance-exams', getEntranceExams);
router.get('/colleges', getColleges);
router.get('/filters', getFilterOptions);

// Protected routes - require authentication
router.use(auth);

// Save a course
router.post('/save/:courseId', saveCourse);

// Get saved courses for current user
router.get('/saved', getSavedCourses);

// Remove a saved course
router.delete('/saved/:courseId', removeSavedCourse);

// Compare courses
router.post('/compare', compareCourses);

module.exports = router;
