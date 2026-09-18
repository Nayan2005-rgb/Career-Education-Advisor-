const GovtResidentialSchool = require('../models/GovtResidentialSchool');

/**
 * Search government residential schools with filters
 */
exports.searchSchools = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      state: req.query.state,
      district: req.query.district,
      gender: req.query.gender,
      entranceExam: req.query.entranceExam,
      hostelAvailable: req.query.hostelAvailable === 'true' ? true : 
                     req.query.hostelAvailable === 'false' ? false : undefined
    };

    const schools = GovtResidentialSchool.search(filters);
    
    // Remove undefined filters for cleaner query
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    res.json({
      schools,
      filters: Object.keys(filters).length > 0 ? filters : null,
      count: schools.length
    });
  } catch (err) {
    console.error('Error searching government residential schools:', err);
    res.status(500).json({ 
      message: 'Unable to search government residential schools. Please try again.' 
    });
  }
};

/**
 * Get government residential schools by category
 */
exports.getSchoolsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const validCategories = [
      'Jawahar Navodaya Vidyalaya',
      'Sainik School',
      'Eklavya Model Residential School',
      'Rashtriya Military School',
      'Government Residential/Ashram School'
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category. Valid categories are: ' + validCategories.join(', ') 
      });
    }

    const schools = GovtResidentialSchool.getByCategory(category);
    
    res.json({
      category,
      schools,
      count: schools.length
    });
  } catch (err) {
    console.error('Error getting government residential schools by category:', err);
    res.status(500).json({ 
      message: 'Unable to get government residential schools by category. Please try again.' 
    });
  }
};

/**
 * Get government residential school details by ID
 */
exports.getSchoolDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const school = GovtResidentialSchool.findById(id);
    
    if (!school) {
      return res.status(404).json({ 
        message: 'Government residential school not found' 
      });
    }

    res.json(school);
  } catch (err) {
    console.error('Error getting government residential school details:', err);
    res.status(500).json({ 
      message: 'Unable to get government residential school details. Please try again.' 
    });
  }
};

/**
 * Get all available states
 */
exports.getStates = async (req, res) => {
  try {
    const states = GovtResidentialSchool.getStates();
    
    res.json({ states });
  } catch (err) {
    console.error('Error getting states:', err);
    res.status(500).json({ 
      message: 'Unable to get states. Please try again.' 
    });
  }
};

/**
 * Get districts by state
 */
exports.getDistrictsByState = async (req, res) => {
  try {
    const { state } = req.params;
    
    const districts = GovtResidentialSchool.getDistrictsByState(state);
    
    res.json({ state, districts });
  } catch (err) {
    console.error('Error getting districts:', err);
    res.status(500).json({ 
      message: 'Unable to get districts. Please try again.' 
    });
  }
};

/**
 * Get all available filters/options
 */
exports.getFilterOptions = async (req, res) => {
  try {
    const schools = GovtResidentialSchool.findAll();
    
    const states = GovtResidentialSchool.getStates();
    const districts = [...new Set(schools.map(s => s.district))].sort();
    
    const categories = [
      'Jawahar Navodaya Vidyalaya',
      'Sainik School',
      'Eklavya Model Residential School',
      'Rashtriya Military School',
      'Government Residential/Ashram School'
    ];

    const genders = [...new Set(schools.map(s => s.gender))].sort();
    const entranceExams = [...new Set(schools.map(s => s.entranceExam))].sort();

    res.json({
      states,
      districts,
      categories,
      genders,
      entranceExams
    });
  } catch (err) {
    console.error('Error getting filter options:', err);
    res.status(500).json({ 
      message: 'Unable to get filter options. Please try again.' 
    });
  }
};
