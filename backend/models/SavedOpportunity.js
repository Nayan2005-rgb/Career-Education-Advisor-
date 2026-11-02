const JsonDB = require('../config/jsonDb');

const savedOpportunityDb = new JsonDB('savedOpportunities.json');

const SavedOpportunity = {
  create: (data) => savedOpportunityDb.create(data),

  findOne: (query) => savedOpportunityDb.findOne(query),

  findById: (id) => savedOpportunityDb.findById(id),

  findAll: () => savedOpportunityDb.findAll(),

  find: (query) => {
    const items = savedOpportunityDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },

  updateById: (id, updates) => savedOpportunityDb.updateById(id, updates),

  deleteById: (id) => savedOpportunityDb.deleteById(id),

  // Get saved opportunities by user ID
  findByUserId: (userId) => {
    const saved = savedOpportunityDb.findAll();
    return saved.filter(item => item.userId === userId);
  },

  // Check if opportunity is saved by user
  isSaved: (userId, opportunityId) => {
    const saved = savedOpportunityDb.findAll();
    return saved.some(item => item.userId === userId && item.opportunityId === opportunityId);
  },

  // Remove saved opportunity by user and opportunity ID
  removeByUserAndOpportunity: (userId, opportunityId) => {
    const items = savedOpportunityDb.findAll();
    const index = items.findIndex(item => item.userId === userId && item.opportunityId === opportunityId);
    if (index === -1) return false;

    items.splice(index, 1);
    savedOpportunityDb.write(items);
    return true;
  }
};

module.exports = SavedOpportunity;
