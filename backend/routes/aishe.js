const express = require('express');

const {
  getUniversityStatistics,
  getCollegeStatistics,
  getProgrammes,
  getDisciplines,
  getHostelStatistics,
  getProgrammeStatistics
} = require('../controllers/aisheController');

const router = express.Router();

router.get('/universities', getUniversityStatistics);
router.get('/colleges', getCollegeStatistics);
router.get('/programmes', getProgrammes);
router.get('/disciplines', getDisciplines);
router.get('/hostels', getHostelStatistics);
router.get('/programme-statistics', getProgrammeStatistics);

module.exports = router;