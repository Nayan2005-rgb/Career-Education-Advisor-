const JsonDB = require('../config/jsonDb');

const resumeDb = new JsonDB('resumes.json');

const Resume = {
  create: (data) => resumeDb.create(data),

  findOne: (query) => resumeDb.findOne(query),

  findById: (id) => resumeDb.findById(id),

  findAll: () => resumeDb.findAll(),

  updateById: (id, updates) => resumeDb.updateById(id, updates),

  deleteById: (id) => resumeDb.deleteById(id),

  // Get resumes by user ID
  findByUserId: (userId) => {
    const resumes = resumeDb.findAll();
    return resumes.filter(resume => resume.userId === userId);
  },

  // Check if resume belongs to user
  isOwner: (resumeId, userId) => {
    const resume = resumeDb.findById(resumeId);
    return resume && resume.userId === userId;
  }
};

module.exports = Resume;
