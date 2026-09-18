const JsonDB = require('../config/jsonDb');

const govtResidentialSchoolDb = new JsonDB('govtResidentialSchools.json');

const GovtResidentialSchool = {
  create: (data) => govtResidentialSchoolDb.create(data),
  
  findOne: (query) => govtResidentialSchoolDb.findOne(query),
  
  findById: (id) => govtResidentialSchoolDb.findById(id),
  
  findAll: () => govtResidentialSchoolDb.findAll(),
  
  find: (query) => {
    const items = govtResidentialSchoolDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => govtResidentialSchoolDb.updateById(id, updates),
  
  deleteById: (id) => govtResidentialSchoolDb.deleteById(id),

  // Search government residential schools with filters
  search: (filters) => {
    const schools = govtResidentialSchoolDb.findAll();
    return schools.filter(school => {
      // Text search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          school.name.toLowerCase().includes(searchTerm) ||
          school.location.toLowerCase().includes(searchTerm) ||
          school.state.toLowerCase().includes(searchTerm) ||
          school.district.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && school.category !== filters.category) return false;

      // State filter
      if (filters.state && school.state !== filters.state) return false;

      // District filter
      if (filters.district && school.district !== filters.district) return false;

      // Gender filter
      if (filters.gender && school.gender !== filters.gender) return false;

      // Entrance exam filter
      if (filters.entranceExam && school.entranceExam !== filters.entranceExam) return false;

      // Hostel filter
      if (filters.hostelAvailable !== undefined && school.hostelAvailable !== filters.hostelAvailable) return false;

      return true;
    });
  },

  // Get schools by category
  getByCategory: (category) => {
    const schools = govtResidentialSchoolDb.findAll();
    const validCategories = [
      'Jawahar Navodaya Vidyalaya',
      'Sainik School',
      'Eklavya Model Residential School',
      'Rashtriya Military School',
      'Government Residential/Ashram School'
    ];

    if (!validCategories.includes(category)) return [];

    return schools.filter(school => school.category === category);
  },

  // Get all available states
  getStates: () => {
    const schools = govtResidentialSchoolDb.findAll();
    return [...new Set(schools.map(school => school.state))].sort();
  },

  // Get districts by state
  getDistrictsByState: (state) => {
    const schools = govtResidentialSchoolDb.findAll();
    const districts = [...new Set(
      schools
        .filter(school => school.state === state)
        .map(school => school.district)
    )].sort();
    return districts;
  }
};

module.exports = GovtResidentialSchool;
