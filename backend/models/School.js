const JsonDB = require('../config/jsonDb');

const schoolDb = new JsonDB('schools.json');
const savedSchoolsDb = new JsonDB('savedSchools.json');

const School = {
  create: (data) => schoolDb.create(data),
  
  findOne: (query) => schoolDb.findOne(query),
  
  findById: (id) => schoolDb.findById(id),
  
  findAll: () => schoolDb.findAll(),
  
  find: (query) => {
    const items = schoolDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => schoolDb.updateById(id, updates),
  
  deleteById: (id) => schoolDb.deleteById(id),

  // Search schools with filters
  search: (filters) => {
    const schools = schoolDb.findAll();
    return schools.filter(school => {
      // Text search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          school.name.toLowerCase().includes(searchTerm) ||
          school.city.toLowerCase().includes(searchTerm) ||
          school.state.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // State filter
      if (filters.state && school.state !== filters.state) return false;

      // City filter
      if (filters.city && school.city !== filters.city) return false;

      // Board filter
      if (filters.board && school.board !== filters.board) return false;

      // School type filter
      if (filters.schoolType && school.schoolType !== filters.schoolType) return false;

      // Budget filter
      if (filters.budget) {
        const budget = parseFloat(filters.budget);
        if (school.annualFee > budget) return false;
      }

      // Hostel availability filter
      if (filters.hostelAvailable !== undefined && school.hostelAvailable !== filters.hostelAvailable) return false;

      return true;
    });
  },

  // Category filters
  getByCategory: (category) => {
    const schools = schoolDb.findAll();
    const categoryMap = {
      'Government School': 'government',
      'Private School': 'private',
      'CBSE': 'cbse',
      'ICSE': 'icse',
      'State Board': 'state',
      'Boarding School': 'boarding',
      'Residential School': 'residential'
    };

    const categoryValue = categoryMap[category];
    if (!categoryValue) return [];

    return schools.filter(school => {
      if (categoryValue === 'government' || categoryValue === 'private') {
        return school.schoolType === categoryValue;
      }
      return school.board === categoryValue || school.schoolType === categoryValue;
    });
  }
};

const SavedSchool = {
  create: (data) => savedSchoolsDb.create(data),
  
  findOne: (query) => savedSchoolsDb.findOne(query),
  
  findById: (id) => savedSchoolsDb.findById(id),
  
  findAll: () => savedSchoolsDb.findAll(),
  
  find: (query) => {
    const items = savedSchoolsDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => savedSchoolsDb.updateById(id, updates),
  
  deleteById: (id) => savedSchoolsDb.deleteById(id),

  // Get saved schools for a user
  getUserSavedSchools: (userId) => {
    const savedSchools = savedSchoolsDb.findAll();
    return savedSchools.filter(item => item.user === userId);
  },

  // Check if school is saved by user
  isSchoolSaved: (userId, schoolId) => {
    const savedSchools = savedSchoolsDb.findAll();
    return savedSchools.some(item => item.user === userId && item.schoolId === schoolId);
  },

  // Remove saved school
  removeSavedSchool: (userId, schoolId) => {
    const savedSchools = savedSchoolsDb.findAll();
    const index = savedSchools.findIndex(item => item.user === userId && item.schoolId === schoolId);
    if (index === -1) return false;
    
    savedSchools.splice(index, 1);
    savedSchoolsDb.write(savedSchools);
    return true;
  }
};

module.exports = { School, SavedSchool };
