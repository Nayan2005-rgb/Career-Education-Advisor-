const { College, SavedCollege } = require('../models/College');

/**
 * Search colleges with filters
 */
exports.searchColleges = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      state: req.query.state,
      city: req.query.city,
      course: req.query.course,
      stream: req.query.stream,
      collegeType: req.query.collegeType,
      entranceExam: req.query.entranceExam,
      hostelAvailable: req.query.hostelAvailable === 'true' ? true : 
                     req.query.hostelAvailable === 'false' ? false : undefined,
      fees: req.query.fees
    };

    const colleges = College.search(filters);
    
    // Remove undefined filters for cleaner query
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    res.json({
      colleges,
      filters: Object.keys(filters).length > 0 ? filters : null,
      count: colleges.length
    });
  } catch (err) {
    console.error('Error searching colleges:', err);
    res.status(500).json({ 
      message: 'Unable to search colleges. Please try again.' 
    });
  }
};

/**
 * Get colleges by career recommendation
 */
exports.getCollegesByCareer = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    
    const colleges = College.getByCareer(careerTitle);
    
    res.json({
      careerTitle,
      colleges,
      count: colleges.length
    });
  } catch (err) {
    console.error('Error getting colleges by career:', err);
    res.status(500).json({ 
      message: 'Unable to get colleges by career. Please try again.' 
    });
  }
};

/**
 * Get colleges by stream
 */
exports.getCollegesByStream = async (req, res) => {
  try {
    const { stream } = req.params;
    
    const validStreams = ['Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Law', 'Management'];

    if (!validStreams.includes(stream)) {
      return res.status(400).json({ 
        message: 'Invalid stream. Valid streams are: ' + validStreams.join(', ') 
      });
    }

    const colleges = College.getByStream(stream);
    
    res.json({
      stream,
      colleges,
      count: colleges.length
    });
  } catch (err) {
    console.error('Error getting colleges by stream:', err);
    res.status(500).json({ 
      message: 'Unable to get colleges by stream. Please try again.' 
    });
  }
};

/**
 * Get college details by ID
 */
exports.getCollegeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const college = College.findById(id);
    
    if (!college) {
      return res.status(404).json({ 
        message: 'College not found' 
      });
    }

    res.json(college);
  } catch (err) {
    console.error('Error getting college details:', err);
    res.status(500).json({ 
      message: 'Unable to get college details. Please try again.' 
    });
  }
};

/**
 * Get all available states
 */
exports.getStates = async (req, res) => {
  try {
    const colleges = College.findAll();
    const states = [...new Set(colleges.map(college => college.state))].sort();
    
    res.json({ states });
  } catch (err) {
    console.error('Error getting states:', err);
    res.status(500).json({ 
      message: 'Unable to get states. Please try again.' 
    });
  }
};

/**
 * Get cities by state
 */
exports.getCitiesByState = async (req, res) => {
  try {
    const { state } = req.params;
    
    const colleges = College.findAll();
    const cities = [...new Set(
      colleges
        .filter(college => college.state === state)
        .map(college => college.city)
    )].sort();
    
    res.json({ state, cities });
  } catch (err) {
    console.error('Error getting cities:', err);
    res.status(500).json({ 
      message: 'Unable to get cities. Please try again.' 
    });
  }
};

/**
 * Save a college for the current user
 */
exports.saveCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const userId = req.user.id;

    // Check if college exists
    const college = College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ 
        message: 'College not found' 
      });
    }

    // Check if already saved
    const alreadySaved = SavedCollege.isCollegeSaved(userId, collegeId);
    if (alreadySaved) {
      return res.status(400).json({ 
        message: 'College already saved' 
      });
    }

    // Save the college
    const savedCollege = await SavedCollege.create({
      user: userId,
      collegeId: collegeId,
      savedAt: new Date().toISOString()
    });

    res.json({
      message: 'College saved successfully',
      savedCollege
    });
  } catch (err) {
    console.error('Error saving college:', err);
    res.status(500).json({ 
      message: 'Unable to save college. Please try again.' 
    });
  }
};

/**
 * Get saved colleges for the current user
 */
exports.getSavedColleges = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const savedColleges = SavedCollege.getUserSavedColleges(userId);
    
    // Get full college details for each saved college
    const collegesWithDetails = await Promise.all(
      savedColleges.map(async (savedCollege) => {
        const college = College.findById(savedCollege.collegeId);
        return {
          ...savedCollege,
          collegeDetails: college
        };
      })
    );

    // Sort by most recently saved
    collegesWithDetails.sort((a, b) => 
      new Date(b.savedAt) - new Date(a.savedAt)
    );

    res.json({
      savedColleges: collegesWithDetails,
      count: collegesWithDetails.length
    });
  } catch (err) {
    console.error('Error getting saved colleges:', err);
    res.status(500).json({ 
      message: 'Unable to get saved colleges. Please try again.' 
    });
  }
};

/**
 * Remove a saved college
 */
exports.removeSavedCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const userId = req.user.id;

    const removed = SavedCollege.removeSavedCollege(userId, collegeId);
    
    if (!removed) {
      return res.status(404).json({ 
        message: 'Saved college not found' 
      });
    }

    res.json({ 
      message: 'College removed from saved list successfully' 
    });
  } catch (err) {
    console.error('Error removing saved college:', err);
    res.status(500).json({ 
      message: 'Unable to remove saved college. Please try again.' 
    });
  }
};

/**
 * Compare multiple colleges
 */
exports.compareColleges = async (req, res) => {
  try {
    const { collegeIds } = req.body;
    
    if (!Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({ 
        message: 'Please provide at least 2 college IDs for comparison' 
      });
    }

    if (collegeIds.length > 4) {
      return res.status(400).json({ 
        message: 'Cannot compare more than 4 colleges at once' 
      });
    }

    // Get college details for each ID
    const colleges = [];
    for (const collegeId of collegeIds) {
      const college = College.findById(collegeId);
      if (college) {
        colleges.push(college);
      }
    }

    if (colleges.length < 2) {
      return res.status(404).json({ 
        message: 'Could not find enough valid colleges for comparison' 
      });
    }

    // Generate comparison data
    const comparison = {
      colleges,
      comparison: {
        fees: colleges.map(c => ({ name: c.name, fee: c.annualFee })),
        ratings: colleges.map(c => ({ name: c.name, rating: c.rating })),
        placement: colleges.map(c => ({ name: c.name, placementRate: c.placementRate })),
        facilities: colleges.map(c => ({ name: c.name, facilities: c.facilities })),
        hostel: colleges.map(c => ({ name: c.name, hostel: c.hostelAvailable })),
        entranceExams: colleges.map(c => ({ name: c.name, exams: c.entranceExams }))
      }
    };

    res.json(comparison);
  } catch (err) {
    console.error('Error comparing colleges:', err);
    res.status(500).json({ 
      message: 'Unable to compare colleges. Please try again.' 
    });
  }
};

/**
 * Get all available filters/options
 */
exports.getFilterOptions = async (req, res) => {
  try {
    const colleges = College.findAll();
    
    const states = [...new Set(colleges.map(c => c.state))].sort();
    const cities = [...new Set(colleges.map(c => c.city))].sort();
    const streams = [...new Set(colleges.map(c => c.stream))].sort();
    const collegeTypes = [...new Set(colleges.map(c => c.collegeType))].sort();
    
    // Get all unique courses
    const allCourses = colleges.flatMap(c => c.courses);
    const courses = [...new Set(allCourses)].sort();
    
    // Get all unique entrance exams
    const allExams = colleges.flatMap(c => c.entranceExams);
    const entranceExams = [...new Set(allExams)].sort();
    
    const feeRanges = [
      { min: 0, max: 50000, label: 'Under ₹50,000' },
      { min: 50000, max: 150000, label: '₹50,000 - ₹1,50,000' },
      { min: 150000, max: 300000, label: '₹1,50,000 - ₹3,00,000' },
      { min: 300000, max: 500000, label: '₹3,00,000 - ₹5,00,000' },
      { min: 500000, max: Infinity, label: 'Above ₹5,00,000' }
    ];

    res.json({
      states,
      cities,
      streams,
      collegeTypes,
      courses,
      entranceExams,
      feeRanges
    });
  } catch (err) {
    console.error('Error getting filter options:', err);
    res.status(500).json({ 
      message: 'Unable to get filter options. Please try again.' 
    });
  }
};
