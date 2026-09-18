const { Scholarship } = require('../models/Scholarship');

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
