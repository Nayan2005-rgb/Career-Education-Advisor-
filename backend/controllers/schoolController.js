const { School, SavedSchool } = require('../models/School');

/**
 * Search schools with filters
 */
exports.searchSchools = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      state: req.query.state,
      city: req.query.city,
      board: req.query.board,
      schoolType: req.query.schoolType,
      budget: req.query.budget,
      hostelAvailable: req.query.hostelAvailable === 'true' ? true : 
                     req.query.hostelAvailable === 'false' ? false : undefined
    };

    const schools = School.search(filters);
    
    // Remove undefined filters for cleaner query
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    res.json({
      schools,
      filters: Object.keys(filters).length > 0 ? filters : null,
      count: schools.length
    });
  } catch (err) {
    console.error('Error searching schools:', err);
    res.status(500).json({ 
      message: 'Unable to search schools. Please try again.' 
    });
  }
};

/**
 * Get schools by category
 */
exports.getSchoolsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const validCategories = [
      'Government School',
      'Private School', 
      'CBSE',
      'ICSE',
      'State Board',
      'Boarding School',
      'Residential School'
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category. Valid categories are: ' + validCategories.join(', ') 
      });
    }

    const schools = School.getByCategory(category);
    
    res.json({
      category,
      schools,
      count: schools.length
    });
  } catch (err) {
    console.error('Error getting schools by category:', err);
    res.status(500).json({ 
      message: 'Unable to get schools by category. Please try again.' 
    });
  }
};

/**
 * Get school details by ID
 */
exports.getSchoolDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const school = School.findById(id);
    
    if (!school) {
      return res.status(404).json({ 
        message: 'School not found' 
      });
    }

    res.json(school);
  } catch (err) {
    console.error('Error getting school details:', err);
    res.status(500).json({ 
      message: 'Unable to get school details. Please try again.' 
    });
  }
};

/**
 * Get all available states
 */
exports.getStates = async (req, res) => {
  try {
    const schools = School.findAll();
    const states = [...new Set(schools.map(school => school.state))].sort();
    
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
    
    const schools = School.findAll();
    const cities = [...new Set(
      schools
        .filter(school => school.state === state)
        .map(school => school.city)
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
 * Save a school for the current user
 */
exports.saveSchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const userId = req.user.id;

    // Check if school exists
    const school = School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ 
        message: 'School not found' 
      });
    }

    // Check if already saved
    const alreadySaved = SavedSchool.isSchoolSaved(userId, schoolId);
    if (alreadySaved) {
      return res.status(400).json({ 
        message: 'School already saved' 
      });
    }

    // Save the school
    const savedSchool = await SavedSchool.create({
      user: userId,
      schoolId: schoolId,
      savedAt: new Date().toISOString()
    });

    res.json({
      message: 'School saved successfully',
      savedSchool
    });
  } catch (err) {
    console.error('Error saving school:', err);
    res.status(500).json({ 
      message: 'Unable to save school. Please try again.' 
    });
  }
};

/**
 * Get saved schools for the current user
 */
exports.getSavedSchools = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const savedSchools = SavedSchool.getUserSavedSchools(userId);
    
    // Get full school details for each saved school
    const schoolsWithDetails = await Promise.all(
      savedSchools.map(async (savedSchool) => {
        const school = School.findById(savedSchool.schoolId);
        return {
          ...savedSchool,
          schoolDetails: school
        };
      })
    );

    // Sort by most recently saved
    schoolsWithDetails.sort((a, b) => 
      new Date(b.savedAt) - new Date(a.savedAt)
    );

    res.json({
      savedSchools: schoolsWithDetails,
      count: schoolsWithDetails.length
    });
  } catch (err) {
    console.error('Error getting saved schools:', err);
    res.status(500).json({ 
      message: 'Unable to get saved schools. Please try again.' 
    });
  }
};

/**
 * Remove a saved school
 */
exports.removeSavedSchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const userId = req.user.id;

    const removed = SavedSchool.removeSavedSchool(userId, schoolId);
    
    if (!removed) {
      return res.status(404).json({ 
        message: 'Saved school not found' 
      });
    }

    res.json({ 
      message: 'School removed from saved list successfully' 
    });
  } catch (err) {
    console.error('Error removing saved school:', err);
    res.status(500).json({ 
      message: 'Unable to remove saved school. Please try again.' 
    });
  }
};

/**
 * Compare multiple schools
 */
exports.compareSchools = async (req, res) => {
  try {
    const { schoolIds } = req.body;
    
    if (!Array.isArray(schoolIds) || schoolIds.length < 2) {
      return res.status(400).json({ 
        message: 'Please provide at least 2 school IDs for comparison' 
      });
    }

    if (schoolIds.length > 4) {
      return res.status(400).json({ 
        message: 'Cannot compare more than 4 schools at once' 
      });
    }

    // Get school details for each ID
    const schools = [];
    for (const schoolId of schoolIds) {
      const school = School.findById(schoolId);
      if (school) {
        schools.push(school);
      }
    }

    if (schools.length < 2) {
      return res.status(404).json({ 
        message: 'Could not find enough valid schools for comparison' 
      });
    }

    // Generate comparison data
    const comparison = {
      schools,
      comparison: {
        fees: schools.map(s => ({ name: s.name, fee: s.annualFee })),
        ratings: schools.map(s => ({ name: s.name, rating: s.rating })),
        studentTeacherRatio: schools.map(s => ({ 
          name: s.name, 
          ratio: (s.studentCount / s.facultyCount).toFixed(1) 
        })),
        facilities: schools.map(s => ({ name: s.name, facilities: s.facilities })),
        boards: schools.map(s => ({ name: s.name, board: s.board })),
        hostel: schools.map(s => ({ name: s.name, hostel: s.hostelAvailable }))
      }
    };

    res.json(comparison);
  } catch (err) {
    console.error('Error comparing schools:', err);
    res.status(500).json({ 
      message: 'Unable to compare schools. Please try again.' 
    });
  }
};

/**
 * Get all available filters/options
 */
exports.getFilterOptions = async (req, res) => {
  try {
    const schools = School.findAll();
    
    const states = [...new Set(schools.map(s => s.state))].sort();
    const cities = [...new Set(schools.map(s => s.city))].sort();
    const boards = [...new Set(schools.map(s => s.board))].sort();
    const schoolTypes = [...new Set(schools.map(s => s.schoolType))].sort();
    
    const feeRanges = [
      { min: 0, max: 50000, label: 'Under ₹50,000' },
      { min: 50000, max: 150000, label: '₹50,000 - ₹1,50,000' },
      { min: 150000, max: 300000, label: '₹1,50,000 - ₹3,00,000' },
      { min: 300000, max: Infinity, label: 'Above ₹3,00,000' }
    ];

    res.json({
      states,
      cities,
      boards,
      schoolTypes,
      feeRanges,
      categories: [
        'Government School',
        'Private School',
        'CBSE',
        'ICSE',
        'State Board',
        'Boarding School',
        'Residential School'
      ]
    });
  } catch (err) {
    console.error('Error getting filter options:', err);
    res.status(500).json({ 
      message: 'Unable to get filter options. Please try again.' 
    });
  }
};
