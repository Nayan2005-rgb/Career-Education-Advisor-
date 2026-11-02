const JsonDB = require('../config/jsonDb');

const applicationTrackingDb = new JsonDB('applicationTracking.json');

const ApplicationTracking = {
  create: (data) => applicationTrackingDb.create(data),

  findOne: (query) => applicationTrackingDb.findOne(query),

  findById: (id) => applicationTrackingDb.findById(id),

  findAll: () => applicationTrackingDb.findAll(),

  find: (query) => {
    const items = applicationTrackingDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },

  updateById: (id, updates) => applicationTrackingDb.updateById(id, updates),

  deleteById: (id) => applicationTrackingDb.deleteById(id),

  // Get applications by user ID
  findByUserId: (userId) => {
    const applications = applicationTrackingDb.findAll();
    return applications.filter(item => item.userId === userId);
  },

  // Get applications by user ID with optional status filter
  findByUserIdAndStatus: (userId, status) => {
    const applications = applicationTrackingDb.findAll();
    return applications.filter(item => item.userId === userId && item.status === status);
  },

  // Check if application exists for user and opportunity
  findByUserAndOpportunity: (userId, opportunityId) => {
    const applications = applicationTrackingDb.findAll();
    return applications.find(item => item.userId === userId && item.opportunityId === opportunityId);
  }
};

module.exports = ApplicationTracking;
