const JsonDB = require('../config/jsonDb');

const scholarshipDb = new JsonDB('scholarships.json');

const Scholarship = {
  create: (data) => scholarshipDb.create(data),
  
  findOne: (query) => scholarshipDb.findOne(query),
  
  findById: (id) => scholarshipDb.findById(id),
  
  findAll: () => scholarshipDb.findAll(),
  
  find: (query) => {
    const items = scholarshipDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => scholarshipDb.updateById(id, updates),
  
  deleteById: (id) => scholarshipDb.deleteById(id),

  // Search scholarships with filters
  search: (filters) => {
    const scholarships = scholarshipDb.findAll();
    return scholarships.filter(scholarship => {
      // Text search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          scholarship.name.toLowerCase().includes(searchTerm) ||
          scholarship.eligibility.toLowerCase().includes(searchTerm) ||
          scholarship.category.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Education level filter
      if (filters.educationLevel && scholarship.educationLevel !== filters.educationLevel) return false;

      // State filter
      if (filters.state && scholarship.state !== filters.state) return false;

      // Course filter
      if (filters.course && !scholarship.courses.includes(filters.course)) return false;

      // Income range filter
      if (filters.incomeRange && scholarship.incomeRange !== filters.incomeRange) return false;

      // Category filter
      if (filters.category && scholarship.category !== filters.category) return false;

      // Provider type filter (Government/Private)
      if (filters.providerType && scholarship.providerType !== filters.providerType) return false;

      return true;
    });
  },

  // Get scholarships by course
  getByCourse: (course) => {
    const scholarships = scholarshipDb.findAll();
    return scholarships.filter(scholarship => 
      scholarship.courses.includes(course)
    );
  },

  // Get scholarships by state
  getByState: (state) => {
    const scholarships = scholarshipDb.findAll();
    return scholarships.filter(scholarship => scholarship.state === state);
  },

  // Get scholarships by category
  getByCategory: (category) => {
    const scholarships = scholarshipDb.findAll();
    return scholarships.filter(scholarship => scholarship.category === category);
  }
};

module.exports = { Scholarship };
