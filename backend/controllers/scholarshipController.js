const { Scholarship, SavedScholarship } = require('../models/Scholarship');
const User = require('../models/User');

/**
 * Search scholarships with filters
 */
exports.searchScholarships = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      educationLevel: req.query.educationLevel,
      state: req.query.state,
      course: req.query.course,
      incomeRange: req.query.incomeRange,
      category: req.query.category,
      providerType: req.query.providerType
    };

    const scholarships = Scholarship.search(filters);
    
    // Remove undefined filters for cleaner query
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    res.json({
      scholarships,
      filters: Object.keys(filters).length > 0 ? filters : null,
      count: scholarships.length
    });
  } catch (err) {
    console.error('Error searching scholarships:', err);
    res.status(500).json({ 
      message: 'Unable to search scholarships. Please try again.' 
    });
  }
};

/**
 * Get scholarships by course
 */
exports.getScholarshipsByCourse = async (req, res) => {
  try {
    const { course } = req.params;
    
    const scholarships = Scholarship.getByCourse(course);
    
    res.json({
      course,
      scholarships,
      count: scholarships.length
    });
  } catch (err) {
    console.error('Error getting scholarships by course:', err);
    res.status(500).json({ 
      message: 'Unable to get scholarships by course. Please try again.' 
    });
  }
};

/**
 * Get scholarships by state
 */
exports.getScholarshipsByState = async (req, res) => {
  try {
    const { state } = req.params;
    
    const scholarships = Scholarship.getByState(state);
    
    res.json({
      state,
      scholarships,
      count: scholarships.length
    });
  } catch (err) {
    console.error('Error getting scholarships by state:', err);
    res.status(500).json({ 
      message: 'Unable to get scholarships by state. Please try again.' 
    });
  }
};

/**
 * Get scholarships by category
 */
exports.getScholarshipsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const scholarships = Scholarship.getByCategory(category);
    
    res.json({
      category,
      scholarships,
      count: scholarships.length
    });
  } catch (err) {
    console.error('Error getting scholarships by category:', err);
    res.status(500).json({ 
      message: 'Unable to get scholarships by category. Please try again.' 
    });
  }
};

/**
 * Get scholarship details by ID
 */
exports.getScholarshipDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const scholarship = Scholarship.findById(id);
    
    if (!scholarship) {
      return res.status(404).json({ 
        message: 'Scholarship not found' 
      });
    }

    res.json(scholarship);
  } catch (err) {
    console.error('Error getting scholarship details:', err);
    res.status(500).json({ 
      message: 'Unable to get scholarship details. Please try again.' 
    });
  }
};

/**
 * Get all available filters/options
 */
exports.getFilterOptions = async (req, res) => {
  try {
    const scholarships = Scholarship.findAll();

    const states = [...new Set(scholarships.map(s => s.state))].sort();
    const educationLevels = [...new Set(scholarships.map(s => s.educationLevel))].sort();
    const categories = [...new Set(scholarships.map(s => s.category))].sort();
    const providerTypes = [...new Set(scholarships.map(s => s.providerType))].sort();

    // Get all unique courses
    const allCourses = scholarships.flatMap(s => s.courses);
    const courses = [...new Set(allCourses)].sort();

    // Get all unique income ranges
    const incomeRanges = [...new Set(scholarships.map(s => s.incomeRange))].sort();

    res.json({
      states,
      educationLevels,
      categories,
      providerTypes,
      courses,
      incomeRanges
    });
  } catch (err) {
    console.error('Error getting filter options:', err);
    res.status(500).json({
      message: 'Unable to get filter options. Please try again.'
    });
  }
};

/**
 * Check eligibility for a scholarship
 */
exports.checkEligibility = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const scholarship = Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({
        message: 'Scholarship not found'
      });
    }

    let userProfile = null;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        userProfile = userWithoutPassword;
      }
    }

    const eligibility = Scholarship.checkEligibility(scholarship, userProfile);

    res.json({
      scholarship: {
        id: scholarship.id,
        name: scholarship.name,
        providerType: scholarship.providerType,
        educationLevel: scholarship.educationLevel,
        state: scholarship.state,
        category: scholarship.category,
        incomeRange: scholarship.incomeRange,
        eligibility: scholarship.eligibility,
        benefits: scholarship.benefits,
        deadline: scholarship.deadline,
        dataSource: scholarship.dataSource,
        officialInfo: scholarship.officialInfo
      },
      eligibility
    });
  } catch (err) {
    console.error('Error checking eligibility:', err);
    res.status(500).json({
      message: 'Unable to check eligibility. Please try again.'
    });
  }
};

/**
 * Check eligibility for multiple scholarships
 */
exports.checkEligibilityBatch = async (req, res) => {
  try {
    const userId = req.user?.id;

    let userProfile = null;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        userProfile = userWithoutPassword;
      }
    }

    const scholarships = Scholarship.findAll();
    const results = scholarships.map(scholarship => {
      const eligibility = Scholarship.checkEligibility(scholarship, userProfile);
      return {
        id: scholarship.id,
        name: scholarship.name,
        eligibility
      };
    });

    res.json({
      results,
      count: results.length
    });
  } catch (err) {
    console.error('Error checking eligibility batch:', err);
    res.status(500).json({
      message: 'Unable to check eligibility. Please try again.'
    });
  }
};

/**
 * Save a scholarship for the current user
 */
exports.saveScholarship = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const userId = req.user.id;

    // Check if scholarship exists
    const scholarship = Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({
        message: 'Scholarship not found'
      });
    }

    // Check if already saved
    const alreadySaved = SavedScholarship.isScholarshipSaved(userId, scholarshipId);
    if (alreadySaved) {
      return res.status(400).json({
        message: 'Scholarship already saved'
      });
    }

    // Save the scholarship
    const savedScholarship = await SavedScholarship.create({
      user: userId,
      scholarshipId: scholarshipId,
      savedAt: new Date().toISOString()
    });

    res.json({
      message: 'Scholarship saved successfully',
      savedScholarship
    });
  } catch (err) {
    console.error('Error saving scholarship:', err);
    res.status(500).json({
      message: 'Unable to save scholarship. Please try again.'
    });
  }
};

/**
 * Get saved scholarships for the current user
 */
exports.getSavedScholarships = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedScholarships = SavedScholarship.getUserSavedScholarships(userId);

    // Get full scholarship details for each saved scholarship
    const scholarshipsWithDetails = await Promise.all(
      savedScholarships.map(async (savedScholarship) => {
        const scholarship = Scholarship.findById(savedScholarship.scholarshipId);
        return {
          ...savedScholarship,
          scholarshipDetails: scholarship
        };
      })
    );

    // Sort by most recently saved
    scholarshipsWithDetails.sort((a, b) =>
      new Date(b.savedAt) - new Date(a.savedAt)
    );

    res.json({
      savedScholarships: scholarshipsWithDetails,
      count: scholarshipsWithDetails.length
    });
  } catch (err) {
    console.error('Error getting saved scholarships:', err);
    res.status(500).json({
      message: 'Unable to get saved scholarships. Please try again.'
    });
  }
};

/**
 * Remove a saved scholarship
 */
exports.removeSavedScholarship = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const userId = req.user.id;

    const removed = SavedScholarship.removeSavedScholarship(userId, scholarshipId);

    if (!removed) {
      return res.status(404).json({
        message: 'Saved scholarship not found'
      });
    }

    res.json({
      message: 'Scholarship removed from saved list successfully'
    });
  } catch (err) {
    console.error('Error removing saved scholarship:', err);
    res.status(500).json({
      message: 'Unable to remove saved scholarship. Please try again.'
    });
  }
};
