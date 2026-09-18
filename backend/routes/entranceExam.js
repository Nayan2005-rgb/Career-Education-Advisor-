const express = require('express');
const router = express.Router();
const {
  searchEntranceExams,
  getEntranceExamsByCourse,
  getEntranceExamsBySubject,
  getEntranceExamsByCollege,
  getEntranceExamsByCareer,
  getEntranceExamDetails,
  getAllEntranceExams,
  getSubjects,
  getCourses,
  getColleges,
  getFilterOptions
} = require('../controllers/entranceExamController');

// Public routes - no authentication required
router.get('/search', searchEntranceExams);
router.get('/course/:courseName', getEntranceExamsByCourse);
router.get('/subject/:subject', getEntranceExamsBySubject);
router.get('/college/:collegeName', getEntranceExamsByCollege);
router.get('/career/:careerTitle', getEntranceExamsByCareer);
router.get('/details/:id', getEntranceExamDetails);
router.get('/all', getAllEntranceExams);
router.get('/subjects', getSubjects);
router.get('/courses', getCourses);
router.get('/colleges', getColleges);
router.get('/filters', getFilterOptions);

module.exports = router;