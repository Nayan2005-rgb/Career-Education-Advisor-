const JsonDB = require('../config/jsonDb');

const collegeDb = new JsonDB('colleges.json');
const savedCollegesDb = new JsonDB('savedColleges.json');

const College = {
  create: (data) => collegeDb.create(data),
  
  findOne: (query) => collegeDb.findOne(query),
  
  findById: (id) => collegeDb.findById(id),
  
  findAll: () => collegeDb.findAll(),
  
  find: (query) => {
    const items = collegeDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => collegeDb.updateById(id, updates),
  
  deleteById: (id) => collegeDb.deleteById(id),

  // Search colleges with filters
  search: (filters) => {
    const colleges = collegeDb.findAll();
    return colleges.filter(college => {
      // Text search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          college.name.toLowerCase().includes(searchTerm) ||
          college.city.toLowerCase().includes(searchTerm) ||
          college.state.toLowerCase().includes(searchTerm) ||
          college.courses.some(course => course.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      // State filter
      if (filters.state && college.state !== filters.state) return false;

      // City filter
      if (filters.city && college.city !== filters.city) return false;

      // Course filter
      if (filters.course && !college.courses.includes(filters.course)) return false;

      // Stream filter
      if (filters.stream && college.stream !== filters.stream) return false;

      // College type filter
      if (filters.collegeType && college.collegeType !== filters.collegeType) return false;

      // Entrance exam filter
      if (filters.entranceExam && !college.entranceExams.includes(filters.entranceExam)) return false;

      // Hostel availability filter
      if (filters.hostelAvailable !== undefined && college.hostelAvailable !== filters.hostelAvailable) return false;

      // Fee filter
      if (filters.fees) {
        const maxFee = parseFloat(filters.fees);
        if (college.annualFee > maxFee) return false;
      }

      return true;
    });
  },

  // Get colleges by career/course recommendation
  getByCareer: (careerTitle) => {
    const colleges = collegeDb.findAll();
    return colleges.filter(college => {
      // Check if college offers courses relevant to the career
      const careerKeywords = careerTitle.toLowerCase().split(' ');
      return college.courses.some(course => 
        careerKeywords.some(keyword => course.toLowerCase().includes(keyword))
      );
    });
  },

  // Get colleges by stream
  getByStream: (stream) => {
    const colleges = collegeDb.findAll();
    return colleges.filter(college => college.stream === stream);
  }
};

const SavedCollege = {
  create: (data) => savedCollegesDb.create(data),
  
  findOne: (query) => savedCollegesDb.findOne(query),
  
  findById: (id) => savedCollegesDb.findById(id),
  
  findAll: () => savedCollegesDb.findAll(),
  
  find: (query) => {
    const items = savedCollegesDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => savedCollegesDb.updateById(id, updates),
  
  deleteById: (id) => savedCollegesDb.deleteById(id),

  // Get saved colleges for a user
  getUserSavedColleges: (userId) => {
    const savedColleges = savedCollegesDb.findAll();
    return savedColleges.filter(item => item.user === userId);
  },

  // Check if college is saved by user
  isCollegeSaved: (userId, collegeId) => {
    const savedColleges = savedCollegesDb.findAll();
    return savedColleges.some(item => item.user === userId && item.collegeId === collegeId);
  },

  // Remove saved college
  removeSavedCollege: (userId, collegeId) => {
    const savedColleges = savedCollegesDb.findAll();
    const index = savedColleges.findIndex(item => item.user === userId && item.collegeId === collegeId);
    if (index === -1) return false;
    
    savedColleges.splice(index, 1);
    savedCollegesDb.write(savedColleges);
    return true;
  }
};

module.exports = { College, SavedCollege };
