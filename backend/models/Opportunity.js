const JsonDB = require('../config/jsonDb');

const opportunityDb = new JsonDB('opportunities.json');

const Opportunity = {
  create: (data) => opportunityDb.create(data),

  findOne: (query) => opportunityDb.findOne(query),

  findById: (id) => opportunityDb.findById(id),

  findAll: () => opportunityDb.findAll(),

  find: (query) => {
    const items = opportunityDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },

  updateById: (id, updates) => opportunityDb.updateById(id, updates),

  deleteById: (id) => opportunityDb.deleteById(id),

  // Search opportunities with filters
  search: (filters) => {
    const items = opportunityDb.findAll();
    return items.filter(item => {
      // Text search (title, company, keywords)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = item.title && item.title.toLowerCase().includes(searchLower);
        const companyMatch = item.company && item.company.toLowerCase().includes(searchLower);
        const keywordsMatch = item.keywords && item.keywords.some(k => k.toLowerCase().includes(searchLower));
        if (!titleMatch && !companyMatch && !keywordsMatch) return false;
      }

      // Opportunity type filter
      if (filters.opportunityType && item.opportunityType !== filters.opportunityType) {
        return false;
      }

      // Location filter
      if (filters.location && item.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Work mode filter
      if (filters.workMode && item.workMode !== filters.workMode) {
        return false;
      }

      // Experience level filter
      if (filters.experienceLevel && item.experienceLevel !== filters.experienceLevel) {
        return false;
      }

      // Skills filter (match any required skill)
      if (filters.skills && filters.skills.length > 0) {
        const itemSkills = (item.requiredSkills || []).map(s => s.toLowerCase());
        const hasMatchingSkill = filters.skills.some(skill =>
          itemSkills.some(itemSkill => itemSkill.includes(skill.toLowerCase()))
        );
        if (!hasMatchingSkill) return false;
      }

      // Education filter
      if (filters.educationLevel && item.requiredEducation) {
        const educationLevels = ['High School', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'];
        const itemLevelIndex = educationLevels.indexOf(item.requiredEducation);
        const filterLevelIndex = educationLevels.indexOf(filters.educationLevel);
        if (itemLevelIndex < filterLevelIndex) return false;
      }

      return true;
    });
  },

  // Sort opportunities
  sort: (opportunities, sortBy) => {
    if (sortBy === 'postingDate') {
      return opportunities.sort((a, b) => new Date(b.postingDate || 0) - new Date(a.postingDate || 0));
    }
    if (sortBy === 'deadline') {
      return opportunities.sort((a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'));
    }
    return opportunities;
  }
};

module.exports = Opportunity;
